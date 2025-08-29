import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { 
  createEvent, 
  getEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent, 
  toggleEventPublish,
  getCategories,
  getAllEventsDebug,
  getUserEvents 
} from '../controllers/eventController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Configuration Multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// Validation rules
const eventValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
  body('description')
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage('La description doit contenir entre 3 et 1000 caractères'),
  body('event_type')
    .isIn(['single', 'recurring'])
    .withMessage('Le type d\'événement doit être "single" ou "recurring"'),
  body('start_date')
    .isISO8601()
    .withMessage('Date de début invalide'),
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('Date de fin invalide'),
  body('start_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de début invalide (format: HH:MM)'),
  body('end_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de fin invalide (format: HH:MM)'),
  body('location_address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  body('location_lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude invalide'),
  body('location_lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude invalide'),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Catégorie invalide'),
  body('duration_type')
    .optional()
    .isIn(['days', 'hours'])
    .withMessage('Le type de durée doit être "days" ou "hours"'),
  body('duration_value')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La valeur de durée doit être un nombre positif'),
  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('Le statut de publication doit être un booléen')
];

const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('event_type')
    .optional()
    .isIn(['single', 'recurring'])
    .withMessage('Le type d\'événement doit être "single" ou "recurring"'),
  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('Date de début invalide'),
  body('start_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de début invalide (format: HH:MM)'),
  body('end_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de fin invalide (format: HH:MM)'),
  body('location_address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  body('location_lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude invalide'),
  body('location_lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude invalide'),
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Catégorie invalide'),
  body('duration_type')
    .optional()
    .isIn(['days', 'hours'])
    .withMessage('Le type de durée doit être "days" ou "hours"'),
  body('duration_value')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La valeur de durée doit être un nombre positif')
];

// Public routes
router.get('/', getEvents);
router.get('/debug/all', getAllEventsDebug); // Route de debug temporaire
router.get('/categories', getCategories);
router.get('/:id', getEventById);

// Protected routes (require authentication)
router.get('/user/events', authenticateToken, getUserEvents); // Route pour les événements de l'utilisateur
router.post('/', authenticateToken, upload.single('banner_image'), eventValidation, createEvent);
router.put('/:id', authenticateToken, upload.single('banner_image'), updateEventValidation, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);
router.patch('/:id/publish', authenticateToken, toggleEventPublish);

export default router;

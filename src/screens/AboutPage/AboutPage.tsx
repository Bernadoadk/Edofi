import React from "react";
import { Layout } from "../../components/Layout";

export const AboutPage = (): JSX.Element => {
  return (
    <Layout>
      <div className="min-h-screen py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-assignment-1dark-navy-blue mb-6">
                À Propos d'Edofi
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Votre plateforme de référence pour découvrir et organiser des événements exceptionnels
              </p>
            </div>

            {/* Mission Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-semibold text-assignment-1dark-navy-blue mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Chez Edofi, nous croyons que chaque événement a le pouvoir de créer des moments inoubliables. 
                Notre mission est de connecter les organisateurs talentueux avec des publics passionnés, 
                en facilitant la découverte et la participation à des expériences extraordinaires.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Depuis notre création, nous avons aidé des milliers d'organisateurs à partager leur passion 
                et des centaines de milliers de participants à vivre des expériences uniques.
              </p>
            </div>

            {/* Values Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-semibold text-assignment-1dark-navy-blue mb-8">
                Nos Valeurs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-assignment-1yellow rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-assignment-1dark-navy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-assignment-1dark-navy-blue mb-2">
                    Passion
                  </h3>
                  <p className="text-gray-600">
                    Nous partageons la passion de nos organisateurs et participants pour créer des expériences extraordinaires.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-color rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-text-black mb-2">
                    Qualité
                  </h3>
                  <p className="text-gray-600">
                    Nous nous engageons à maintenir les plus hauts standards de qualité pour tous nos événements.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-assignment-1yellow rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-assignment-1dark-navy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-assignment-1dark-navy-blue mb-2">
                    Communauté
                  </h3>
                  <p className="text-gray-600">
                    Nous construisons une communauté vibrante où chacun peut partager et découvrir.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div>
              <h2 className="text-3xl font-semibold text-assignment-1dark-navy-blue mb-8">
                Notre Équipe
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Notre équipe passionnée travaille sans relâche pour créer la meilleure expérience possible 
                pour nos utilisateurs. Nous combinons expertise technique, créativité et dévouement 
                pour faire d'Edofi la plateforme de référence.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Rejoignez-nous dans cette aventure et faites partie de notre communauté grandissante !
              </p>
            </div>
          </div>
        </div>
    </Layout>
  );
}; 
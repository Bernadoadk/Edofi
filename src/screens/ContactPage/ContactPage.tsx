import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Layout } from "../../components/Layout";

export const ContactPage = (): JSX.Element => {
  return (
    <Layout>
      <div className="min-h-screen py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-assignment-1dark-navy-blue mb-6">
                Contactez-nous
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nous sommes là pour vous aider ! N'hésitez pas à nous contacter pour toute question, 
                suggestion ou assistance concernant nos événements.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-assignment-1dark-navy-blue mb-6">
                  Envoyez-nous un message
                </h2>
                <Card className="border border-gray-200">
                  <CardContent className="p-8">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                          </label>
                          <Input
                            type="text"
                            placeholder="Votre prénom"
                            className="h-12 border border-gray-300 rounded-lg focus:border-assignment-1dark-navy-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                          </label>
                          <Input
                            type="text"
                            placeholder="Votre nom"
                            className="h-12 border border-gray-300 rounded-lg focus:border-assignment-1dark-navy-blue"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          className="h-12 border border-gray-300 rounded-lg focus:border-assignment-1dark-navy-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sujet
                        </label>
                        <Input
                          type="text"
                          placeholder="Sujet de votre message"
                          className="h-12 border border-gray-300 rounded-lg focus:border-assignment-1dark-navy-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          rows={6}
                          placeholder="Votre message..."
                          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:border-assignment-1dark-navy-blue focus:outline-none resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-assignment-1dark-navy-blue hover:bg-assignment-1dark-navy-blue/90 text-white font-semibold rounded-lg"
                      >
                        Envoyer le message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-semibold text-assignment-1dark-navy-blue mb-6">
                  Informations de contact
                </h2>
                
                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-assignment-1yellow rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-assignment-1dark-navy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-assignment-1dark-navy-blue mb-1">
                        Email
                      </h3>
                      <p className="text-gray-600">contact@Edofi.com</p>
                      <p className="text-gray-600">support@Edofi.com</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-assignment-1yellow rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-assignment-1dark-navy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-assignment-1dark-navy-blue mb-1">
                        Téléphone
                      </h3>
                      <p className="text-gray-600">+33 1 23 45 67 89</p>
                      <p className="text-gray-600">Lun-Ven: 9h-18h</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-assignment-1yellow rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-assignment-1dark-navy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-assignment-1dark-navy-blue mb-1">
                        Adresse
                      </h3>
                      <p className="text-gray-600">
                        123 Rue de l'Innovation<br />
                        75001 Paris, France
                      </p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-assignment-1yellow rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-assignment-1dark-navy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-assignment-1dark-navy-blue mb-1">
                        Réseaux sociaux
                      </h3>
                      <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-assignment-1yellow">Facebook</a>
                        <a href="#" className="text-gray-600 hover:text-assignment-1yellow">Twitter</a>
                        <a href="#" className="text-gray-600 hover:text-assignment-1yellow">Instagram</a>
                        <a href="#" className="text-gray-600 hover:text-assignment-1yellow">LinkedIn</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
}; 
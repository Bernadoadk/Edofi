import React, { useState } from 'react';
import { AccountInfo } from "./components/AccountInfo";
import { ChangeEmail } from "./components/ChangeEmail";
import { ChangePassword } from "./components/ChangePassword";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/Layout";

type SettingsTab = 'account' | 'email' | 'password';

export const SettingsPage = (): JSX.Element => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const tabs = [
    { id: 'account', label: 'Informations du compte', icon: '👤' },
    { id: 'email', label: 'Changer l\'adresse e-mail', icon: '📧' },
    { id: 'password', label: 'Mot de passe', icon: '🔒' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountInfo user={user} />;
      case 'email':
        return <ChangeEmail user={user} />;
      case 'password':
        return <ChangePassword />;
      default:
        return <AccountInfo user={user} />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-assignment-1dark-navy-blue mb-2">
              Paramètres
            </h1>
            <p className="text-gray-600">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>

          {/* Settings Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel - Navigation */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-assignment-1dark-navy-blue mb-4">
                  Paramètres du compte
                </h2>
                
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as SettingsTab)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-100 text-assignment-1dark-navy-blue font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-assignment-1dark-navy-blue'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Panel - Content */}
            <div className="flex-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { openSettingsModal } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    openSettingsModal('appearance');
    navigate('/', { replace: true });
  }, [openSettingsModal, navigate]);

  return null;
};

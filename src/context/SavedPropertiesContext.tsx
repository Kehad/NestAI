"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SavedPropertiesContextType {
  savedProperties: any[];
  toggleSaveProperty: (property: any) => void;
  isPropertySaved: (id: string) => boolean;
}

const SavedPropertiesContext = createContext<SavedPropertiesContextType | undefined>(undefined);

export const SavedPropertiesProvider = ({ children }: { children: ReactNode }) => {
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedProperties") || "[]");
      setSavedProperties(saved);
      setIsLoaded(true);
    } catch (e) {
      console.error("Failed to load saved properties", e);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("savedProperties", JSON.stringify(savedProperties));
    }
  }, [savedProperties, isLoaded]);

  const toggleSaveProperty = (property: any) => {
    setSavedProperties((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  const isPropertySaved = (id: string) => {
    return savedProperties.some((p) => p.id === id);
  };

  return (
    <SavedPropertiesContext.Provider value={{ savedProperties, toggleSaveProperty, isPropertySaved }}>
      {children}
    </SavedPropertiesContext.Provider>
  );
};

export const useSavedProperties = () => {
  const context = useContext(SavedPropertiesContext);
  if (context === undefined) {
    throw new Error("useSavedProperties must be used within a SavedPropertiesProvider");
  }
  return context;
};

import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotesViewPage } from "./NotesViewPage";
import { NotesEditPage } from "./NotesEditPage";

export const NotesDetailsRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<NotesViewPage />} />
    <Route path="/edit" element={<NotesEditPage />} />
  </Routes>
);

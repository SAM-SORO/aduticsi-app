"use client";

import React, { type SelectHTMLAttributes } from "react";

export function AutoSubmitSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      onChange={(e) => {
        // Appelle le onChange passé en prop s'il existe
        if (props.onChange) {
          props.onChange(e);
        }
        // Soumet le formulaire parent automatiquement
        e.target.form?.requestSubmit();
      }}
    />
  );
}

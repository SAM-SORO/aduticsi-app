"use client";

import React, { type InputHTMLAttributes, useEffect, useState, useRef } from "react";
import { Input } from "./input";

interface AutoSubmitInputProps extends InputHTMLAttributes<HTMLInputElement> {
  debounceMs?: number;
}

export function AutoSubmitInput({ debounceMs = 400, defaultValue, ...props }: AutoSubmitInputProps) {
  const [value, setValue] = useState(defaultValue || "");
  const formRef = useRef<HTMLFormElement | null>(null);
  const isFirstRender = useRef(true);

  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);

  // Synchronisation de la valeur pendant le rendu (Pattern React recommandé)
  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setValue(defaultValue || "");
  }

  useEffect(() => {
    // Éviter de soumettre lors du premier rendu
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (formRef.current) {
        // Déclenche la soumission du formulaire parent
        formRef.current.requestSubmit();
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  return (
    <Input
      {...props}
      ref={(el) => {
        if (el) formRef.current = el.form;
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

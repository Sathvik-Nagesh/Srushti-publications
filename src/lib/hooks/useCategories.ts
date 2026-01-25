'use client'

import { useState, useEffect } from 'react'

// Simple in-memory cache for categories to avoid refetching
let cachedCategories: any[] | null = null;
let isFetching = false;
let listeners: ((cats: any[]) => void)[] = [];

export function useCategories() {
  const [categories, setCategories] = useState<any[]>(cachedCategories || []);
  
  useEffect(() => {
    if (cachedCategories) {
        setCategories(cachedCategories);
        return;
    }

    if (isFetching) {
        listeners.push(setCategories);
        return;
    }

    isFetching = true;
    fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                cachedCategories = data.data;
                setCategories(data.data);
                listeners.forEach(l => l(data.data));
                listeners = [];
            }
        })
        .finally(() => {
            isFetching = false;
        });
  }, []);

  return categories;
}

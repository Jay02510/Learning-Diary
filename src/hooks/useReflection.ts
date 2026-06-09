import { useState, useCallback } from "react";

export interface UseReflectionResult {
  reflection: string | null;
  loading: boolean;
  error: string | null;
  generateReflection: (
    studentName: string,
    subject: string,
    tags: string[]
  ) => Promise<string | null>;
  reset: () => void;
}

export function useReflection(): UseReflectionResult {
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateReflection = useCallback(
    async (studentName: string, subject: string, tags: string[]): Promise<string | null> => {
      setLoading(true);
      setError(null);
      setReflection(null);

      try {
        const response = await fetch("/api/generate-reflection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentName,
            subject,
            tags,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status code: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        const resultText = data.reflection || "";
        setReflection(resultText);
        return resultText;
      } catch (err: any) {
        console.error("Error generating progress reflection:", err);
        const errMsg = err.message || "Fatal exception during progress reflection synthesis.";
        setError(errMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setReflection(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    reflection,
    loading,
    error,
    generateReflection,
    reset,
  };
}

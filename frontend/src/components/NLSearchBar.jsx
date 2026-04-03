import React, { useState, useRef, useEffect } from 'react';

const NLSearchBar = ({ students, onFilter }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const debounceTimer = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const processQuery = (q) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    setIsProcessing(true);
    const text = q.toLowerCase();

    debounceTimer.current = setTimeout(() => {
      let result = [...students];

      if (!text.trim()) {
        onFilter(students);
        setIsProcessing(false);
        return;
      }

      // Feature: Marks/Score threshold (e.g. "marks < 40" or "score > 80")
      const marksLessMatch = text.match(/(?:marks|score|gpa)\s*<\s*(\d+)/);
      const marksGreaterMatch = text.match(/(?:marks|score|gpa)\s*>\s*(\d+)/);
      
      if (marksLessMatch) {
        const val = Number(marksLessMatch[1]);
        result = result.filter(s => text.includes('gpa') ? Number(s.gpa) < val : Number(s.marks) < val);
      }
      if (marksGreaterMatch) {
         const val = Number(marksGreaterMatch[1]);
         result = result.filter(s => text.includes('gpa') ? Number(s.gpa) > val : Number(s.marks) > val);
      }

      // Feature: Attendance threshold
      const attLessMatch = text.match(/attendance\s*<\s*(\d+)/);
      const attGreaterMatch = text.match(/attendance\s*>\s*(\d+)/);

      if (attLessMatch) {
         const val = Number(attLessMatch[1]);
         result = result.filter(s => Number(s.attendance) < val);
      }
      if (attGreaterMatch) {
         const val = Number(attGreaterMatch[1]);
         result = result.filter(s => Number(s.attendance) > val);
      }

      // Feature: Risk classification
      if (text.includes('high risk') || text.includes('risk high') || text.includes('at-risk')) {
         result = result.filter(s => s.riskLevel && s.riskLevel.id === 'high');
      } else if (text.includes('medium risk') || text.includes('risk medium')) {
         result = result.filter(s => s.riskLevel && s.riskLevel.id === 'medium');
      }

      // Feature: Trend classification
      if(text.includes('improving')) {
         result = result.filter(s => s.trend === 'Improving');
      } else if (text.includes('declining') || text.includes('dropping')) {
         result = result.filter(s => s.trend === 'Declining');
      }
      
      // Subject filtering by simple text presence
      const subjectsFound = Array.from(new Set(students.map(s => s.subject))).filter(sub => {
         const lowSub = sub.toLowerCase();
         // match if user typed the whole subject name, OR typed at least 4 letters of it (like 'math', 'phys')
         if (text.includes(lowSub)) return true;
         // Handle partial matches like "math" vs "mathematics"
         for (let word of text.split(' ')) {
            if (word.length >= 4 && lowSub.includes(word)) return true;
         }
         return false;
      });
      
      if (subjectsFound.length > 0) {
         result = result.filter(s => subjectsFound.includes(s.subject));
      }

      onFilter(result);
      setIsProcessing(false);
    }, 400); // Debounce and simulate AI delay
  };

  const handleClear = () => {
     setQuery('');
     if (debounceTimer.current) clearTimeout(debounceTimer.current);
     setIsProcessing(false);
     onFilter(students);
  };

  return (
    <div className="nl-search-bar futuristic-card" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--primary-color)' }}>
       <div className="ai-icon holographic" style={{ fontSize: '1.5rem' }}>🧠</div>
       <div style={{ flex: 1 }}>
          <input 
            type="text" 
            placeholder="Ask AI: e.g. 'Show students with marks < 50', 'high risk', or 'attendance < 60'" 
            value={query}
            onChange={(e) => {
               setQuery(e.target.value);
               processQuery(e.target.value);
            }}
            className="futuristic-input"
            style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', outline: 'none', fontSize: '1.1rem' }}
          />
       </div>
       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isProcessing && <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>}
          <div className="ai-badge" style={{ margin: 0 }}>OmniSearch™ Local</div>
          {query && <button onClick={handleClear} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>}
       </div>
    </div>
  );
};

export default NLSearchBar;

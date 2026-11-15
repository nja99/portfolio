/**
 * Entry point. Loads the font + global CSS, then mounts <App />.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// "standard" = the variable font file that contains BOTH the weight (wght)
// and width (wdth) axes. The width axis powers the hero animation.
import '@fontsource-variable/archivo/standard.css';
import './index.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

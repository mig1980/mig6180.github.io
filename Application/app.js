// Brand Configuration
const BRAND = {
  name: 'Quantum Investor Digest',
  colors: {
    primary: '#8B5CF6',
    secondary: '#500070',
    accent: '#A040D0',
    lavender: '#EDE9FE',
    white: '#FFFFFF',
    outperform: '#16A375',
    hold: '#A3A7B5'
  },
  fontFamily: 'Public Sans'
};



// Presets Data
const PRESETS = [
  { name: 'Outperform', metric: '+4.58% Total Return', color: '#16A375', icon: '📈', headline: 'GenAI-Managed Stocks Portfolio' },
  { name: 'Hold', metric: 'Strategic Positioning', color: '#A3A7B5', icon: '⏸', headline: 'Market Analysis & Insights' },
  { name: 'Rebalance', metric: 'Portfolio Adjustment', color: '#8B5CF6', icon: '⚖️', headline: 'Weekly Rebalancing Update' },
  { name: 'New Entry', metric: 'Position Added', color: '#3B82F6', icon: '📊', headline: 'Portfolio Expansion' }
];

// Format configurations
const FORMATS = {
  blog: { width: 1200, height: 630, name: 'Blog Header' },
  twitter: { width: 1200, height: 675, name: 'X (Twitter)' },
  linkedin: { width: 1200, height: 627, name: 'LinkedIn' },
  instagram: { width: 1080, height: 1080, name: 'Instagram' }
};

// State Management (in-memory only, no localStorage)
let state = {
  weekNumber: 'Week 6',
  headline: 'GenAI-Managed Stocks Portfolio',
  subheadline: '+4.58% Total Return',
  customText: '',
  metricColor: '#16A375',
  activePreset: null,
  currentFormat: 'blog',
  canvasWidth: 1200,
  canvasHeight: 630
};

// Initialize app
function init() {
  renderPresets();
  setupEventListeners();
  updatePreview();
}

// Render Presets
function renderPresets() {
  const container = document.getElementById('presetButtons');
  container.innerHTML = PRESETS.map(preset => `
    <button class="preset-btn" data-preset="${preset.name}" style="border-color: ${preset.color}; color: ${preset.color};">
      <span style="font-size: 20px;">${preset.icon}</span>
      <span>${preset.name}</span>
    </button>
  `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
  // Format buttons
  document.getElementById('formatButtons').addEventListener('click', (e) => {
    const btn = e.target.closest('.format-btn');
    if (btn) {
      const format = btn.dataset.format;
      const width = parseInt(btn.dataset.width);
      const height = parseInt(btn.dataset.height);
      
      // Remove active class from all format buttons
      document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update state
      state.currentFormat = format;
      state.canvasWidth = width;
      state.canvasHeight = height;
      
      // Resize canvas
      const canvas = document.getElementById('previewCanvas');
      canvas.width = width;
      canvas.height = height;
      
      // Update download button texts
      document.getElementById('downloadBtn').innerHTML = `📥 Download PNG (${width}×${height})`;
      document.getElementById('downloadWebpBtn').innerHTML = `📥 Download WebP (${width}×${height})`;
      
      updatePreview();
    }
  });

  // Input fields
  document.getElementById('weekNumber').addEventListener('input', (e) => {
    state.weekNumber = e.target.value;
    updatePreview();
  });

  document.getElementById('headline').addEventListener('input', (e) => {
    state.headline = e.target.value;
    updatePreview();
  });

  document.getElementById('subheadline').addEventListener('input', (e) => {
    state.subheadline = e.target.value;
    updatePreview();
  });

  document.getElementById('customText').addEventListener('input', (e) => {
    state.customText = e.target.value;
    updatePreview();
  });

  // Presets
  document.getElementById('presetButtons').addEventListener('click', (e) => {
    const btn = e.target.closest('.preset-btn');
    if (btn) {
      const presetName = btn.dataset.preset;
      const preset = PRESETS.find(p => p.name === presetName);
      
      // Remove active class from all presets
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Apply preset
      state.activePreset = preset;
      state.headline = preset.headline;
      state.subheadline = preset.metric;
      state.metricColor = preset.color;
      document.getElementById('headline').value = preset.headline;
      document.getElementById('subheadline').value = preset.metric;
      updatePreview();
    }
  });

  // Download buttons
  document.getElementById('downloadBtn').addEventListener('click', downloadImage);
  document.getElementById('downloadWebpBtn').addEventListener('click', downloadImageWebP);
}

// Update Preview
function updatePreview() {
  const canvas = document.getElementById('previewCanvas');
  const ctx = canvas.getContext('2d');
  const { canvasWidth, canvasHeight } = state;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw purple gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  gradient.addColorStop(0, BRAND.colors.primary);
  gradient.addColorStop(1, BRAND.colors.secondary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw text content
  drawTextContent(ctx);
}

// Draw Text Content
function drawTextContent(ctx) {
  const { canvasWidth, canvasHeight, currentFormat } = state;
  const textColor = '#FFFFFF';
  const isSquare = currentFormat === 'instagram';
  
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';

  // Scale factors for different formats
  const scale = isSquare ? 0.9 : 1;
  const padding = isSquare ? 50 : 60;
  
  // Brand name - top left
  const brandFontSize = Math.round(28 * scale);
  ctx.font = `700 ${brandFontSize}px "Public Sans", sans-serif`;
  ctx.fillText(BRAND.name, padding, 70 * scale);

  // Week number - large bold
  const weekFontSize = Math.round(64 * scale);
  ctx.font = `700 ${weekFontSize}px "Public Sans", sans-serif`;
  const weekY = isSquare ? 160 : 170;
  ctx.fillText(state.weekNumber, padding, weekY);

  // Headline - main text
  const headlineFontSize = Math.round(48 * scale);
  ctx.font = `700 ${headlineFontSize}px "Public Sans", sans-serif`;
  const maxWidth = canvasWidth - (padding * 2);
  const headlineLines = wrapText(ctx, state.headline, maxWidth);
  let yOffset = isSquare ? 240 : 250;
  const lineHeight = Math.round(60 * scale);
  
  headlineLines.forEach((line, i) => {
    ctx.fillText(line, padding, yOffset + (i * lineHeight));
  });

  // Performance metric
  if (state.subheadline) {
    yOffset = yOffset + (headlineLines.length * lineHeight) + 30;
    
    // Use metric color from state or preset
    ctx.fillStyle = state.metricColor;
    const metricFontSize = Math.round(28 * scale);
    ctx.font = `600 ${metricFontSize}px "Public Sans", sans-serif`;
    ctx.fillText(state.subheadline, padding, yOffset);
  }

  // Custom text (optional secondary metric)
  if (state.customText) {
    const customFontSize = Math.round(24 * scale);
    ctx.font = `600 ${customFontSize}px "Public Sans", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.9;
    ctx.fillText(state.customText, padding, yOffset + 50);
    ctx.globalAlpha = 1.0;
  }

  // Footer - quantuminvestor.net at bottom center
  const footerFontSize = Math.round(18 * scale);
  ctx.font = `600 ${footerFontSize}px "Public Sans", sans-serif`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  const footerY = canvasHeight - (isSquare ? 50 : 40);
  ctx.fillText('quantuminvestor.net', canvasWidth / 2, footerY);
}

// Helper: Wrap text
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Download Image as PNG
function downloadImage() {
  const canvas = document.getElementById('previewCanvas');
  const formatName = FORMATS[state.currentFormat].name;
  
  // Create download link
  const link = document.createElement('a');
  const weekStr = state.weekNumber.replace(/\s+/g, '-').toLowerCase();
  const formatStr = state.currentFormat;
  const filename = `qid-${weekStr}-${formatStr}.png`;
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
  
  showNotification(`${formatName} PNG downloaded! 📥`);
}

// Download Image as WebP
function downloadImageWebP() {
  const canvas = document.getElementById('previewCanvas');
  const formatName = FORMATS[state.currentFormat].name;
  
  // Create download link
  const link = document.createElement('a');
  const weekStr = state.weekNumber.replace(/\s+/g, '-').toLowerCase();
  const formatStr = state.currentFormat;
  const filename = `qid-${weekStr}-${formatStr}.webp`;
  link.download = filename;
  link.href = canvas.toDataURL('image/webp', 0.95);
  link.click();
  
  showNotification(`${formatName} WebP downloaded! 📥`);
}

// Show Notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${BRAND.colors.primary};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-family: ${BRAND.fontFamily};
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
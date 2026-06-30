const MODULE_ID = 'called-shots-5e';

const CALLED_SHOTS = [
  { label: 'No Called Shot', penalty: 0, tag: null },
  { label: 'Medium (−3)', penalty: -3, tag: 'Medium' },
  { label: 'Small (−6)', penalty: -6, tag: 'Small' },
  { label: 'Tiny (−9)', penalty: -9, tag: 'Tiny' },
  { label: 'Instant Kill (−12)', penalty: -12, tag: 'Instant Kill' }
];

let _selectedPenalty = 0;
let _selectedTag = null;
let _lastAppId = null;

Hooks.once('init', () => {
  console.log(`${MODULE_ID} | Initializing Called Shots for 5e`);
});

Hooks.on('renderRollConfigurationDialog', (app, element) => {
  _handleDialog(app, element);
});

function _handleDialog(app, el) {
  if (!_isAttack(app, el)) return;

  // Reset penalty when a brand-new dialog opens (not on re-renders)
  const appId = app.id ?? app.appId;
  if (appId !== _lastAppId) {
    _selectedPenalty = 0;
    _lastAppId = appId;
  }

  // Don't double-inject into the same render
  if (el.querySelector('.called-shots-5e')) return;

  const group = document.createElement('div');
  group.classList.add('form-group', 'called-shots-5e');
  group.innerHTML = `
    <label>Called Shot Target Size</label>
    <div class="form-fields">
      <select name="called-shot-penalty" class="called-shots-5e-select">
        ${CALLED_SHOTS.map(s => `<option value="${s.penalty}" data-tag="${s.tag ?? ''}">${s.label}</option>`).join('')}
      </select>
    </div>
    <p class="hint called-shots-5e-hint">Smaller targets are harder to hit.</p>
    <p class="called-shots-5e-desc"></p>
  `;

  // Insert before the situational bonus field
  const sitField = el.querySelector('[name="roll.0.situational"]');
  const anchor = sitField?.closest('.form-group');
  if (anchor) anchor.before(group);
  else (el.querySelector('form') ?? el).prepend(group);

  const select = group.querySelector('select');

  // Restore selection across re-renders
  select.value = _selectedPenalty;
  _updateDesc(group, _selectedTag);

  // Apply stored penalty to the situational field
  _applyPenalty(el);

  select.addEventListener('change', () => {
    _selectedPenalty = parseInt(select.value) || 0;
    _selectedTag = select.selectedOptions[0]?.dataset.tag || null;
    _applyPenalty(el);
    _updateDesc(group, _selectedTag);
  });

  app?.setPosition?.({ height: 'auto' });
}

function _updateDesc(group, tag) {
  const desc = group.querySelector('.called-shots-5e-desc');
  if (!desc) return;
  desc.textContent = tag ? `Called Shots - ${tag}` : '';
}

function _applyPenalty(el) {
  const field = el.querySelector('[name="roll.0.situational"]');
  if (!field) return;
  // Set the value directly — do NOT dispatch change/input events
  // to avoid triggering a dialog re-render cascade
  field.value = _selectedPenalty ? `${_selectedPenalty}` : '';
}

function _isAttack(app, el) {
  const title = (app.options?.window?.title ?? app.title ?? '').toLowerCase();
  if (title.includes('attack')) return true;
  const heading = (
    el.querySelector('.window-title, .dialog-title, header h1, header h2')
      ?.textContent ?? ''
  ).toLowerCase();
  if (heading.includes('attack')) return true;
  return app.options?.rollType === 'attack' || app.config?.type === 'attack';
}

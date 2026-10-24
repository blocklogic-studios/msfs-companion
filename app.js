// MSFS Companion – core logic

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Tabs
$$('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab').forEach(t => {
      t.classList.remove('tab-active');
      t.classList.add('text-slate-400');
    });
    btn.classList.add('tab-active');
    btn.classList.remove('text-slate-400');

    $$('.tab-content').forEach(c => c.classList.add('hidden'));
    $(`#tab-${btn.dataset.tab}`).classList.remove('hidden');
  });
});

// Checklist type switcher
$$('.checklist-type').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.checklist-type').forEach(b => {
      b.classList.remove('bg-sky-600', 'text-white');
      b.classList.add('bg-cockpit-700', 'text-slate-300');
    });
    btn.classList.add('bg-sky-600', 'text-white');
    btn.classList.remove('bg-cockpit-700', 'text-slate-300');

    if (btn.dataset.type === 'ga') {
      $('#checklist-ga').classList.remove('hidden');
      $('#checklist-airliner').classList.add('hidden');
    } else {
      $('#checklist-ga').classList.add('hidden');
      $('#checklist-airliner').classList.remove('hidden');
    }
  });
});

// Load saved username
const savedUser = localStorage.getItem('simbriefUser');
if (savedUser) $('#simbriefUser').value = savedUser;

// Main load function
$('#loadBtn').addEventListener('click', loadOFP);
$('#simbriefUser').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadOFP();
});

async function loadOFP() {
  const username = $('#simbriefUser').value.trim();
  if (!username) {
    alert('Please enter your SimBrief username');
    return;
  }

  localStorage.setItem('simbriefUser', username);
  $('#status').textContent = 'Loading…';
  $('#loadBtn').disabled = true;
  $('#loadBtn').textContent = 'Loading…';

  try {
    // SimBrief public JSON endpoint
    const url = `https://www.simbrief.com/api/xml.fetcher.php?username=${encodeURIComponent(username)}&json=1`;
    const res = await fetch(url);
    
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    if (data.fetch && data.fetch.status === 'Error') {
      throw new Error(data.fetch.msg || 'Could not find a flight plan for this username');
    }

    renderOFP(data);
    await loadMETARs(data);
    $('#status').textContent = 'OFP loaded';
  } catch (err) {
    console.error(err);
    alert(err.message || 'Failed to load SimBrief OFP. Make sure you have generated a plan recently.');
    $('#status').textContent = 'Error';
  } finally {
    $('#loadBtn').disabled = false;
    $('#loadBtn').textContent = 'Load OFP';
  }
}

function renderOFP(data) {
  const general = data.general || {};
  const origin = data.origin || {};
  const destination = data.destination || {};
  const aircraft = data.aircraft || {};
  const fuel = data.fuel || {};
  const weights = data.weights || {};
  const times = data.times || {};

  $('#ofp-empty').classList.add('hidden');
  $('#ofp-content').classList.remove('hidden');

  // Header
  $('#callsign').textContent = general.icao_airline && general.flight_number 
    ? `${general.icao_airline}${general.flight_number}` 
    : (general.callsign || '—');
  
  $('#aircraft').textContent = aircraft.icaocode 
    ? `${aircraft.icaocode} • ${aircraft.name || ''}` 
    : (aircraft.name || '—');

  $('#route').textContent = `${origin.icao_code || '????'} → ${destination.icao_code || '????'}`;
  
  const blockTime = times.est_block || times.sched_block;
  $('#flight-time').textContent = blockTime ? formatMinutes(blockTime) : '—';

  // Numbers
  $('#cruise').textContent = general.initial_altitude 
    ? `FL${String(Math.round(general.initial_altitude / 100)).padStart(3, '0')}` 
    : '—';
  
  $('#distance').textContent = general.route_distance 
    ? `${Math.round(general.route_distance)} nm` 
    : '—';

  const blockFuel = fuel.plan_ramp || fuel.avg_fuel_flow; // plan_ramp is common
  $('#fuel').textContent = fuel.plan_ramp 
    ? `${Math.round(fuel.plan_ramp)} ${fuel.units || 'kg'}` 
    : '—';

  $('#payload').textContent = weights.payload 
    ? `${Math.round(weights.payload)} ${weights.units || 'kg'}` 
    : '—';

  // Times & airports
  $('#dep-airport').textContent = `${origin.icao_code || ''} ${origin.name || ''}`;
  $('#arr-airport').textContent = `${destination.icao_code || ''} ${destination.name || ''}`;
  
  $('#dep-time').textContent = times.sched_out || times.est_out || '—';
  $('#arr-time').textContent = times.sched_in || times.est_in || '—';

  // Route
  $('#route-string').textContent = general.route || '—';
}

async function loadMETARs(data) {
  const depIcao = data.origin?.icao_code;
  const arrIcao = data.destination?.icao_code;

  if (depIcao) {
    $('#dep-metar').textContent = 'Loading…';
    try {
      const metar = await fetchMetar(depIcao);
      $('#dep-metar').textContent = metar || 'No METAR available';
    } catch {
      $('#dep-metar').textContent = 'Failed to load METAR';
    }
  }

  if (arrIcao) {
    $('#arr-metar').textContent = 'Loading…';
    try {
      const metar = await fetchMetar(arrIcao);
      $('#arr-metar').textContent = metar || 'No METAR available';
    } catch {
      $('#arr-metar').textContent = 'Failed to load METAR';
    }
  }
}

async function fetchMetar(icao) {
  // Using the free Aviation Weather Center API proxy style
  // Fallback to a simple text endpoint
  try {
    const res = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icao}&format=raw`);
    if (res.ok) {
      const text = await res.text();
      return text.trim() || null;
    }
  } catch (e) {}

  // Backup: CheckWX style or just return null
  return null;
}

function formatMinutes(mins) {
  const m = parseInt(mins, 10);
  if (isNaN(m)) return mins;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}h ${min.toString().padStart(2, '0')}m`;
}

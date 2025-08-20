const voterKey = 'voterId';

async function castVote(voterId, candidate) {
    if (!voterId) { alert('Enter voter ID'); return; }
    fetch('/.netlify/functions/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, candidate })
    }).then(r => r.json()).then(d => { alert('Vote cast!'); showResults(); });
}

async function showResults() {
    const res = await fetch('https://raw.githubusercontent.com/pandiyarajk/topspot/main/votes.json');
    const votes = await res.json();
    const tbody = document.getElementById('resultsTable');
    if (!tbody) return;
    let html = '';
    for (let [person, voters] of Object.entries(votes)) {
        html += `<tr><td>${person}</td><td>${voters.length}</td><td>${voters.join(', ')}</td></tr>`;
    }
    tbody.innerHTML = html;
}

function clearVoter() { localStorage.removeItem(voterKey); alert('Your vote cleared from this device'); }

async function renderBarChart() {
    const res = await fetch('https://raw.githubusercontent.com/pandiyarajk/topspot/main/votes.json');
    const votes = await res.json();
    const ctx = document.getElementById('barChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(votes),
            datasets: [{
                label: 'Votes',
                data: Object.values(votes).map(arr => arr.length),
                backgroundColor: 'rgba(54, 162, 235, 0.7)'
            }]
        }
    });
}
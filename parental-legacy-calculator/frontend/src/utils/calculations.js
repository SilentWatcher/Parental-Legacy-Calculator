const FACTORS = [
  { name: 'Genetic Inheritance', min: 9.333, max: 10.777 },
  { name: 'Constitutional Vitality', min: 8.111, max: 9.111 },
  { name: 'Mental Patterns', min: 6.111, max: 7.111 },
  { name: 'Intellectual Capacity', min: 6.333, max: 6.999 },
  { name: 'Emotional Foundation', min: 7.111, max: 7.999 },
  { name: 'Spiritual Lineage', min: 5.011, max: 6.011 },
  { name: 'Soul Connections', min: 5.111, max: 6.222 },
];

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function calculateLifeFactors(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  const isOddDay = day % 2 !== 0;
  const dateStr = `${day}${month}${year}`;
  const baseSeed = hashDate(dateStr);
  const rand = seededRandom(baseSeed);

  const factors = FACTORS.map((factor) => {
    const range = factor.max - factor.min;
    const rawValue = factor.min + rand() * range;

    let motherRatio, fatherRatio;
    if (isOddDay) {
      motherRatio = 0.505 + rand() * 0.045;
    } else {
      motherRatio = 0.455 + rand() * 0.045;
    }
    fatherRatio = 1 - motherRatio;

    const total = parseFloat(rawValue.toFixed(3));
    const mother = parseFloat((total * motherRatio).toFixed(3));
    const father = parseFloat((total - mother).toFixed(3));

    return {
      name: factor.name,
      mother,
      father,
      total,
    };
  });

  const motherTotal = parseFloat(
    factors.reduce((sum, f) => sum + f.mother, 0).toFixed(3)
  );
  const fatherTotal = parseFloat(
    factors.reduce((sum, f) => sum + f.father, 0).toFixed(3)
  );
  const grandTotal = parseFloat((motherTotal + fatherTotal).toFixed(3));

  const diff = Math.abs(motherTotal - fatherTotal);
  const scale = 100 / grandTotal;
  const adjustedMotherTotal = parseFloat((motherTotal * scale).toFixed(3));
  const adjustedFatherTotal = parseFloat((fatherTotal * scale).toFixed(3));

  factors.forEach((f) => {
    const motherShare = motherTotal > 0 ? f.mother / motherTotal : 0;
    const fatherShare = fatherTotal > 0 ? f.father / fatherTotal : 0;
    f.mother = parseFloat((adjustedMotherTotal * motherShare).toFixed(3));
    f.father = parseFloat((adjustedFatherTotal * fatherShare).toFixed(3));
    f.total = parseFloat((f.mother + f.father).toFixed(3));
  });

  const finalMotherTotal = parseFloat(
    factors.reduce((sum, f) => sum + f.mother, 0).toFixed(3)
  );
  const finalFatherTotal = parseFloat(
    factors.reduce((sum, f) => sum + f.father, 0).toFixed(3)
  );

  return {
    factors,
    motherTotal: finalMotherTotal,
    fatherTotal: finalFatherTotal,
    grandTotal: parseFloat((finalMotherTotal + finalFatherTotal).toFixed(3)),
    dominantParent: finalMotherTotal > finalFatherTotal ? 'Mother' : 'Father',
    isOddDay,
    dateString,
  };
}

export function exportToCSV(results) {
  const headers = ['Factor', 'Mother', 'Father', 'Total'];
  const rows = results.factors.map((f) => [
    f.name,
    f.mother.toFixed(3),
    f.father.toFixed(3),
    f.total.toFixed(3),
  ]);
  rows.push(['TOTAL', results.motherTotal.toFixed(3), results.fatherTotal.toFixed(3), results.grandTotal.toFixed(3)]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `parental-legacy-${results.dateString}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(results, chartImages = []) {
  Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]).then(([{ jsPDF }, { applyPlugin }]) => {
    applyPlugin(jsPDF);
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text('Parental Legacy & Life Factors Report', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Date of Birth: ${results.dateString}`, 14, 34);
    doc.text(`Dominant Parent: ${results.dominantParent}`, 14, 42);
    doc.text(`Day Type: ${results.isOddDay ? 'Odd (Mother Dominant)' : 'Even (Father Dominant)'}`, 14, 50);

    const tableData = results.factors.map((f) => [
      f.name,
      f.mother.toFixed(3),
      f.father.toFixed(3),
      f.total.toFixed(3),
    ]);
    tableData.push([
      'TOTAL',
      results.motherTotal.toFixed(3),
      results.fatherTotal.toFixed(3),
      results.grandTotal.toFixed(3),
    ]);

    doc.autoTable({
      startY: 58,
      head: [['Factor', 'Mother', 'Father', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 10 },
    });

    if (chartImages && chartImages.length > 0) {
      chartImages.forEach((imgDataUrl, idx) => {
        doc.addPage();
        doc.setFontSize(16);
        doc.setTextColor(139, 92, 246);
        const titles = ['Bar Chart - Mother vs Father', 'Radar Chart - Distribution', "Mother's Legacy Share", "Father's Legacy Share"];
        doc.text(titles[idx] || `Chart ${idx + 1}`, 14, 20);

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 28;
        const imgHeight = Math.min(imgWidth * 0.65, pageHeight - 40);

        doc.addImage(imgDataUrl, 'PNG', 14, 28, imgWidth, imgHeight);
      });
    }

    doc.save(`parental-legacy-${results.dateString}.pdf`);
  }).catch((err) => {
    console.error('PDF export failed:', err);
    alert('Failed to generate PDF. Please try again.');
  });
}

export function generateInsight(results) {
  const { factors, motherTotal, fatherTotal, grandTotal } = results;

  const dominantParent = motherTotal > fatherTotal ? 'Mother' : 'Father';
  const dominantPct = ((Math.max(motherTotal, fatherTotal) / grandTotal) * 100).toFixed(1);

  const sorted = [...factors].sort((a, b) => b.total - a.total);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const motherPct = ((motherTotal / grandTotal) * 100).toFixed(1);
  const fatherPct = ((fatherTotal / grandTotal) * 100).toFixed(1);
  const diff = Math.abs(motherTotal - fatherTotal);

  let balance;
  if (diff < 2) balance = 'Balanced';
  else if (diff < 8) balance = 'Slightly Skewed';
  else balance = 'Highly Skewed';

  let interpretation;
  if (balance === 'Balanced') {
    interpretation = `Both parental contributions are nearly equal (${motherPct}% / ${fatherPct}%). The distribution across all 7 factors shows minimal bias toward either side. This indicates a symmetrical inheritance profile.`;
  } else {
    const minor = motherTotal < fatherTotal ? 'maternal' : 'paternal';
    const major = motherTotal > fatherTotal ? 'maternal' : 'paternal';
    interpretation = `${major.charAt(0).toUpperCase() + major.slice(1)} contribution leads at ${dominantPct}% of total score. The ${minor} side trails by ${diff.toFixed(1)} points. Factor "${strongest.name}" contributes most (${strongest.total.toFixed(3)}), while "${weakest.name}" is the lowest at ${weakest.total.toFixed(3)}.`;
  }

  return {
    dominantParent,
    dominantPct,
    strongest: { name: strongest.name, score: strongest.total },
    weakest: { name: weakest.name, score: weakest.total },
    balance,
    interpretation,
    motherPct,
    fatherPct,
  };
}

export function validateDate(dateString) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateString)) return false;

  const [, day, month, year] = dateString.match(regex).map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  )
    return false;

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) return false;

  return true;
}

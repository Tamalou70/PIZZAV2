async function exportTaxImage() {
  const node = document.getElementById("taxSheet");
  await exportNodeAsJpg(node, `fiche-imposition-${Date.now()}.jpg`);
}

async function exportNodeAsJpg(node, filename) {
  if (!node) return alert("Élément introuvable.");

  const rect = node.getBoundingClientRect();
  const clone = node.cloneNode(true);
  const wrapper = document.createElement("div");

  wrapper.style.position = "fixed";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.style.width = `${Math.max(rect.width, 900)}px`;
  wrapper.style.background = "#211713";
  wrapper.style.color = "white";
  wrapper.style.padding = "24px";
  wrapper.appendChild(clone);

  document.body.appendChild(wrapper);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${wrapper.scrollWidth}" height="${wrapper.scrollHeight}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${wrapper.innerHTML}</div>
      </foreignObject>
    </svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = wrapper.scrollWidth;
  canvas.height = wrapper.scrollHeight;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#211713";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/jpeg", 0.95);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
  document.body.removeChild(wrapper);
}

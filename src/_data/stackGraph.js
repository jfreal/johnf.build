// Geometry and lookups for the web of projects, built from stack.json.
// Templates read it as stackGraph: the diagram draws `edges`, and each product
// page reads `fits[product.key]` for its "How it fits" box.

const stack = require("./stack.json");

const RADIUS = { core: 62, side: 50 };
// How far each line bows off the straight path, as a share of its length.
// Bowing to the right of the direction of travel means A→B and B→A curve to
// opposite sides instead of drawing on top of each other.
const BOW = 0.12;
const ARROW_GAP = 7;

const nodes = Object.fromEntries(
    stack.nodes.map((node) => [node.key, { ...node, r: node.core ? RADIUS.core : RADIUS.side }]),
);

const round = (n) => Math.round(n * 10) / 10;

// Step `dist` from point p toward point q.
function toward(p, q, dist) {
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const len = Math.hypot(dx, dy);
    return { x: p.x + (dx / len) * dist, y: p.y + (dy / len) * dist };
}

function edgePath(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    const control = {
        x: (from.x + to.x) / 2 - (dy / len) * len * BOW,
        y: (from.y + to.y) / 2 + (dx / len) * len * BOW,
    };
    const start = toward(from, control, from.r);
    const end = toward(to, control, to.r + ARROW_GAP);
    return `M ${round(start.x)} ${round(start.y)} Q ${round(control.x)} ${round(control.y)} ${round(end.x)} ${round(end.y)}`;
}

for (const link of stack.links) {
    for (const key of [link.from, link.to]) {
        if (!nodes[key]) throw new Error(`[stack] link names unknown node "${key}"`);
    }
}

const edges = stack.links.map((link) => ({
    ...link,
    planned: link.status === "planned",
    fromName: nodes[link.from].name,
    toName: nodes[link.to].name,
    fromHref: nodes[link.from].href,
    toHref: nodes[link.to].href,
    d: edgePath(nodes[link.from], nodes[link.to]),
}));

// Per project: what it does for others, and what others do for it.
const fits = {};
for (const key of Object.keys(nodes)) {
    fits[key] = {
        gives: edges.filter((edge) => edge.from === key),
        gets: edges.filter((edge) => edge.to === key),
        chapter: stack.chapters.find((chapter) => chapter.key === key) || null,
    };
}

module.exports = {
    nodes: Object.values(nodes),
    edges,
    fits,
    chapters: stack.chapters,
};

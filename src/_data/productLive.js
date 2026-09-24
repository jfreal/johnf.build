// The live half of each product: Screenery screenshots and the Merge & Tell
// changelog, fetched once per build. The words live in products.json.
// Templates read it as productLive[product.key].

const products = require("./products.json");
const screenery = require("../../lib/screenery");
const changelog = require("../../lib/changelog");

module.exports = async function () {
    const entries = await Promise.all(
        products.map(async (product) => {
            const shots = product.screenery ? await screenery.load(product) : { hero: null, gallery: [] };
            const updates = product.changelog ? await changelog.load(product.changelog) : [];
            return [product.key, { ...shots, changelog: updates }];
        }),
    );
    return Object.fromEntries(entries);
};

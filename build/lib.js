"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomWeightedTrait = void 0;
const lodash_1 = require("lodash");
function getRandomWeightedTrait(traits, traitName) {
    const category = (0, lodash_1.find)(traits, (t) => t.name == traitName);
    if (!category) {
        throw new Error(`There is no category named [${traitName}]!`);
    }
    const items = category.items;
    let sum = (0, lodash_1.sumBy)(category.items, (i) => i.weight);
    const threshold = Math.random() * sum;
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].weight;
        if (total >= threshold) {
            return items[i].name;
        }
    }
    return items[items.length - 1].name;
}
exports.getRandomWeightedTrait = getRandomWeightedTrait;
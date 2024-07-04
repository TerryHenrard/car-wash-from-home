/*
const servives = {
  service:[
    [type | size, price, time]
  ]
}
*/

const services = {
  exteriors: [
    ["citadine", 50, 60],
    ["berline_coupe", 55, 75],
    ["break_suv", 60, 90],
    ["camionnette_s", 70, 105],
    ["camionnette_m", 80, 120],
    ["camionnette_l", 90, 135],
  ],
  interiors: [
    ["citadine", 80, 90],
    ["berline_coupe", 90, 105],
    ["break_suv", 100, 120],
    ["camionnette_s", 100, 120],
    ["camionnette_m", 100, 120],
    ["camionnette_l", 100, 120],
  ],
  options: [
    ["nettoyage_bloc_moteur", 30, 30],
    ["nettoyage_sieges_cuir_alcantara", 25, 20],
    ["shampoing_siege", 70, 45],
    ["shampoing_tapis", 40, 20],
    ["shampoing_moquette", 60, 45],
  ],
  finishing: [
    ["polissage", 600, 180],
    ["ceramique_carrosserie", 200, 60],
    ["ceramique_jantes", 90, 30],
    ["ceramique_vitres", 75, 15],
    ["renovateur_pneus", 15, 5],
    ["impermeabilisant_textiles", 15, 5],
    ["protection_cuir", 20, 5],
    ["anti_buee", 10, 5],
    ["renovateur_joints", 40, 30],
    ["protection_plastiques", 20, 5],
  ],
};

/**
 * @param {Object} object - The object to transform.
 * @returns {Object} The transformed object.
 * @description loops over the object keys and reduces each array of arrays to an object containing a 'price' property and a 'time' property. The final object is an object of objects of objects containing 2 properties.
 */

export default ((object) => {
  for (const key in object) {
    object[key] = object[key].reduce((acc, [type, price, time]) => {
      acc[type] = { price, time };
      return acc;
    }, {});
  }

  return object;
})(services);

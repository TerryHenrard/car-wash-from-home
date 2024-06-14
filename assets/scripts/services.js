/*
const servives = {
  service:[
    [type | size, price, time]
  ]
}
*/

const services = {
  interiors: [
    ["citadine", 35, 90],
    ["berline_coupe", 40, 105],
    ["break_suv", 45, 120],
    ["camionnette_s", 50, 120],
    ["camionnette_m", 55, 120],
    ["camionnette_l", 60, 120],
  ],
  exteriors: [
    ["citadine", 25, 60],
    ["berline_coupe", 30, 75],
    ["break_suv", 35, 90],
    ["camionnette_s", 50, 105],
    ["camionnette_m", 60, 120],
    ["camionnette_l", 70, 135],
  ],
  options: [
    ["nettoyage_bloc_moteur", 30, 30],
    ["nettoyage_sieges_cuir_alcantara", 25, 20],
    ["shampoing_siege", 70, 45],
    ["shampoing_tapis", 40, 20],
    ["shampoing_moquette", 60, 45],
  ],
  finishing: [
    ["polissage", 250, 120],
    ["ceramique_carrosserie", 120, 60],
    ["ceramique_jantes", 80, 30],
    ["ceramique_vitres", 70, 15],
    ["renovateur_pneus", 30, 5],
    ["impermeabilisant_textiles", 25, 5],
    ["protection_cuir", 30, 5],
    ["anti_buee", 20, 5],
    ["renovateur_joints", 30, 15],
    ["protection_plastiques", 25, 5],
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

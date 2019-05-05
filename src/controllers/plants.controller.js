const {connectionPool} = require('../db/dbConnect');

const getIdDescription = (row) => ({
    id: row.id,
    description: row.description,
});

const plantsController = {
    getPlantsDictionary() {
        return connectionPool
            .query(
                `SELECT ID, BOTANICAL_NAME, NAME, LIGHT, TEMPERATURE, HUMIDITY, WATERING, SOIL, RECOMMENDED_WATERING_INTERVAL
                FROM plants.plants;`,
            )
            .then((results) => {
                return results.map((row) => ({
                    id: row.ID,
                    botanicalName: row.BOTANICAL_NAME,
                    name: row.NAME,
                    light: row.LIGHT,
                    temperature: row.TEMPERATURE,
                    humidity: row.HUMIDITY,
                    watering: row.WATERING,
                    soil: row.SOIL,
                    recommendedWateringInterval: row.RECOMMENDED_WATERING_INTERVAL,
                }));
            });
    },

    getPopularPlantsList() {
        return connectionPool.query(`SELECT id, name, botanical_name FROM plants.v_popular_plants;`).then((results) => {
            return results.map((row) => ({
                id: row.id,
                botanicalName: row.botanical_name,
                name: row.name,
            }));
        });
    },

    getDictionaries() {
        return Promise.all([
            connectionPool.query(`SELECT id, description FROM plants.light;`),
            connectionPool.query(`SELECT id, description FROM plants.temperature;`),
            connectionPool.query(`SELECT id, description FROM plants.humidity;`),
            connectionPool.query(`SELECT id, description FROM plants.watering;`),
            connectionPool.query(`SELECT id, description FROM plants.soil;`),
        ]).then(([light, temperature, humidity, watering, soil]) => {
            return {
                light: light.map(getIdDescription),
                temperature: temperature.map(getIdDescription),
                humidity: humidity.map(getIdDescription),
                watering: watering.map(getIdDescription),
                soil: soil.map(getIdDescription),
            };
        });
    }
};

module.exports = plantsController;

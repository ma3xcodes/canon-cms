module.exports = function(sequelize, db) {

  const g = sequelize.define("story_generator",
    {
      id: {
        type: db.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: db.TEXT,
        defaultValue: ""
      },
      api: {
        type: db.TEXT,
        defaultValue: ""
      },
      description: {
        type: db.TEXT,
        defaultValue: ""
      },
      logic: {
        type: db.TEXT,
        defaultValue: "return {}"
      },
      logic_simple: {
        type: db.JSON,
        defaultValue: null
      },
      simple: {
        type: db.BOOLEAN,
        defaultValue: true
      },
      story_id: {
        type: db.INTEGER,
        onDelete: "cascade",
        references: {
          model: "canon_cms_story",
          key: "id"
        }
      },
      allowed: {
        type: db.STRING,
        defaultValue: "always"
      }
    },
    {
      tableName: "canon_cms_story_generator",
      freezeTableName: true,
      timestamps: false
    }
  );

  return g;

};

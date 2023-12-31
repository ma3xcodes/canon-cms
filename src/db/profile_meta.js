module.exports = function(sequelize, db) {

  const p = sequelize.define("profile_meta",
    {
      id: {
        type: db.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      profile_id: {
        type: db.INTEGER,
        onDelete: "cascade",
        references: {
          model: "canon_cms_profile",
          key: "id"
        }
      },
      slug: {
        type: db.STRING,
        defaultValue: ""
      },
      dimension: db.STRING,
      levels: db.ARRAY(db.TEXT),
      measure: db.STRING,
      ordering: db.INTEGER,
      cubeName: db.STRING,
      visible: {
        type: db.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "canon_cms_profile_meta",
      freezeTableName: true,
      timestamps: false
    }
  );

  p.associate = models => {
    p.hasMany(models.search, {foreignKey: "cubeName", sourceKey: "cubeName", as: "members", constraints: false});
    p.belongsTo(models.profile, {foreignKey: "id", sourceKey: "profile_id", as: "profile", constraints: false});
  };

  return p;

};

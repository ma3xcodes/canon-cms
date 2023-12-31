const models = {
  author: require.resolve("./src/db/author.js"),
  author_content: require.resolve("./src/db/author_content.js"),
  formatter: require.resolve("./src/db/formatter.js"),
  generator: require.resolve("./src/db/generator.js"),
  image: require.resolve("./src/db/image.js"),
  image_content: require.resolve("./src/db/image_content.js"),
  materializer: require.resolve("./src/db/materializer.js"),
  profile: require.resolve("./src/db/profile.js"),
  profile_content: require.resolve("./src/db/profile_content.js"),
  profile_meta: require.resolve("./src/db/profile_meta.js"),
  search: require.resolve("./src/db/search.js"),
  search_content: require.resolve("./src/db/search_content.js"),
  section: require.resolve("./src/db/section.js"),
  section_content: require.resolve("./src/db/section_content.js"),
  section_description: require.resolve("./src/db/section_description.js"),
  section_description_content: require.resolve("./src/db/section_description_content.js"),
  section_selector: require.resolve("./src/db/section_selector.js"),
  section_stat: require.resolve("./src/db/section_stat.js"),
  section_stat_content: require.resolve("./src/db/section_stat_content.js"),
  section_subtitle: require.resolve("./src/db/section_subtitle.js"),
  section_subtitle_content: require.resolve("./src/db/section_subtitle_content.js"),
  section_visualization: require.resolve("./src/db/section_visualization.js"),
  selector: require.resolve("./src/db/selector.js"),
  story: require.resolve("./src/db/story.js"),
  story_content: require.resolve("./src/db/story_content.js"),
  story_description: require.resolve("./src/db/story_description.js"),
  story_description_content: require.resolve("./src/db/story_description_content.js"),
  story_footnote: require.resolve("./src/db/story_footnote.js"),
  story_footnote_content: require.resolve("./src/db/story_footnote_content.js"),
  story_generator: require.resolve("./src/db/story_generator.js"),
  story_materializer: require.resolve("./src/db/story_materializer.js"),
  story_selector: require.resolve("./src/db/story_selector.js"),
  storysection: require.resolve("./src/db/storysection.js"),
  storysection_content: require.resolve("./src/db/storysection_content.js"),
  storysection_description: require.resolve("./src/db/storysection_description.js"),
  storysection_description_content: require.resolve("./src/db/storysection_description_content.js"),
  storysection_selector: require.resolve("./src/db/storysection_selector.js"),
  storysection_stat: require.resolve("./src/db/storysection_stat.js"),
  storysection_stat_content: require.resolve("./src/db/storysection_stat_content.js"),
  storysection_subtitle: require.resolve("./src/db/storysection_subtitle.js"),
  storysection_subtitle_content: require.resolve("./src/db/storysection_subtitle_content.js"),
  storysection_visualization: require.resolve("./src/db/storysection_visualization.js")
};

module.exports = {
  modelPaths: models
};

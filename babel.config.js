module.exports = function (api) {
    api.cache(true);
  
    const presets = [ 'env' ];
  
    return {
      presets,
      plugins
    };
  }
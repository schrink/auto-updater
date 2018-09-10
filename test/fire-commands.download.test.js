var should = require('should');
var fs = require('fs');

var AutoUpdater = require('../auto-updater');

describe('Fire Commands: Download', function() {

  describe('Download update', function() {
    global.__basedir = `${__dirname}/../`;
    var instance = new AutoUpdater({
      pathToJson: 'test/assets/',
      repo: 'juampi92/auto-updater',
      branch: 'master',
      devmode: true,
      progressDebounce: 0
    });

    instance.jsons = {
      client: {
        "version": "0.0.4",
      },
      remote: {
        "version": "0.1.0",
      }
    };
    instance.updateName = instance.update_dest + '-' + instance.jsons.remote.version + '.zip';

    instance.on('error', function(e) {
      throw 'Error' + e;
    });

    it('starting download', function() {});

    instance.on('download.progress', function(n, perc) {
      // Used to test debounce
      //console.log(perc);
    });

    it('should download and check ', function(done) {
      this.timeout(15000);

      instance.on('update.not-installed', function(name) {
        throw 'update.not-installed';
        done();
      });
      instance.on('update.downloaded', function() {
        done();
      });

      instance.fire('download-update');

    });

    it('should have the file', function() {
      instance.updateName.should.be.exactly('update-0.1.0.zip');
      fs.existsSync(instance.updateName).should.be.exactly(true);
    });

    it('should already exist', function(done) {
      instance.removeAllListeners('update.not-installed');
      instance.removeAllListeners('update.downloaded');

      instance.on('update.not-installed', function(name) {
        done();
      });
      instance.on('update.downloaded', function() {
        throw 'update.downloaded';
        done();
      });

      instance.fire('download-update');

    });

    it('should remove the update file', function() {
      fs.unlinkSync(instance.updateName);
    })
  });

});
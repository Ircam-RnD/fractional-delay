var assert = require('assert');
var FractionalDelay = require('../fractional-delay.es6.js');

describe("FractionalDelay tests", function() {
    var fd = new FractionalDelay(44100);
    it('should set delay correctly', function(){
        fd.setDelay(0.5);
    });
    it('should throw error when delay > maxDelayTime', function(){
        assert.throws(function() { fd.setDelay(2); }, Error);
    });
    it('should return delay', function(){
        var delay = 0.3
        fd.setDelay(delay);
        assert.equal(fd.getDelay(), delay);
    })
});

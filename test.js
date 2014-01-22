var Toucan = require('./toucan.js');
var assert = require('chai').assert;

describe('Toucan', function(){
    it('should accept no parameters', function(){
        var token = new Toucan();
        assert.isObject(token);
    });

    it('should allow method chaining', function(){
        var token = new Toucan();
        assert.equal(token, token.permit('test'), 'permit does not return the token');
        assert.equal(token, token.deny('test2'), 'deny does not return the token');
        assert.equal(token, token.lock(), 'lock does not return the token');
    });

    it('should permit something', function(){
        var token = new Toucan();
        token.permit('eat').lock();
        assert.equal(true, token.can('eat'), "toucan should be able to eat");
    });

    it('should deny by default', function(){
        var token = new Toucan();
        token.lock();
        assert.equal(false, token.can('eat'), "toucan should deny by default");
    });

    it('should deny', function(){
        var token = new Toucan();
        token.permit('eat').lock();
        assert.equal(false, token.can('jump'), "toucan should deny");
    });

    it('should not interfere with other tokens', function(){
        var token1 = new Toucan();
        var token2 = new Toucan();
        var token3 = new Toucan();

        token1.permit('eat').lock();
        token2.permit('fly').lock();
        token3.permit('sleep');

        assert.equal(true, token1.can('eat'));
        assert.equal(false, token1.can('fly'));

        assert.equal(false, token2.can('eat'));
        assert.equal(true, token2.can('fly'));

        assert.throws(function(){
            token3.can('do anything');
        }, Error);
    });

    it('should allow all', function(){
        var token = new Toucan();
        token.permit("*").lock();

        assert.equal(true, token.can('do anything'));
    });

    it('should allow all except explicitly denied permissions', function(){
        var token = new Toucan();
        token.permit("*").deny('break database').lock();

        assert.equal(true, token.can('do anything'));
        assert.equal(false, token.can('break database'));
    });

    it('should not allow permissions to be added after locking', function(){
        var token = new Toucan();
        token.permit('eat').lock();
        assert.throws(function(){
            token.permit('sleep');
        }, Error);

        assert.equal(false, token.can('sleep'));

    });

})
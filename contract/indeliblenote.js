"use strict";

var IndelibleNote = function() {
    LocalContractStorage.defineProperties(this, {
        maxKeyLength: null,
        maxContentLength: null,
        size: null
    });
    LocalContractStorage.defineMapProperty(this, "notes");
    LocalContractStorage.defineMapProperty(this, "indexes");
};

IndelibleNote.prototype = {
    init: function (maxKeyLength, maxContentLength) {
        this.maxKeyLength = maxKeyLength;
        this.maxContentLength = maxContentLength;
        this.size = 0;
    },
    createNote: function(key, content) {
        if (key.length > this.maxKeyLength) {
            throw new Error('Note Key Length Exceed Limit');
        }
        if (content.length > this.maxContentLength) {
            throw new Error('Note Content Length Exceed Limit');
        }
        var note = this.notes.get(key);
        if (note) {
            throw new Error('Note Key has been used');
        }
        this.notes.put(key, content);
        this.indexes.put(this.size, key);
        this.size += 1;
    },
    getNote: function(key) {
        return this.notes.get(key);
    },
    listNotes: function(offset, limit) {
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (offset > this.size || offset < 0) {
            throw new Error("offset is not valid");
        }
        var number = offset + limit;
        if (number > this.size) {
            number = this.size;
        }
        var res = [];
        for (var i = offset; i < number; i++) {
            var key = this.indexes.get(i);
            var content = this.notes.get(key);
            res.push({ 'key': key, 'content': content});
        }
        return res;
    }
};

module.exports = IndelibleNote;

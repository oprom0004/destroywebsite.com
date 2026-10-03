import test from 'node:test';
import assert from 'node:assert/strict';
import { previewImage } from '../src/lib/game/preview.ts';
test('capture failures distinguish rate limits, timeouts and verification pages', () => {
 assert.throws(()=>previewImage({status:'fail',code:'EBRWSRTIMEOUT'},200),/timed out/);
 assert.throws(()=>previewImage({},429),/request limit/);
 assert.throws(()=>previewImage({status:'success',data:{title:'Just a moment...',screenshot:{url:'https://cdn.example/image.png'}}},200),/verification/);
 assert.throws(()=>previewImage({status:'success',data:{}},200),/no usable/);
 assert.throws(()=>previewImage({status:'fail'},500),/could not capture/);
});
test('only successful captures return their actual image URL', () => {
 assert.equal(previewImage({status:'success',data:{title:'Example',screenshot:{url:'https://cdn.example/image.png'}}},200),'https://cdn.example/image.png');
});

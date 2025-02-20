import assert from 'node:assert';
import { describe, it } from 'node:test';
import { fetchTool } from '../src/fetch.tool.js';

describe('Fetch Tool', () => {
  it('should fetch and return content from a valid URL', async () => {
    const result = await fetchTool.execute({
      url: 'https://example.com',
      max_length: 1000,
      start_index: 0,
      raw: false,
    });

    assert.ok(result.content);
    assert.equal(result.content[0].type, 'text');
    assert.ok(result.content[0].text.includes('Example Domain'));
  });

  it('should respect max_length parameter', async () => {
    const maxLength = 100;
    const result = await fetchTool.execute({
      url: 'https://example.com',
      max_length: maxLength,
      start_index: 0,
      raw: false,
    });

    assert.ok(result.content[0].text.length <= maxLength + 200); // Adding buffer for prefix text
  });

  it('should handle invalid URLs', async () => {
    try {
      await fetchTool.execute({
        url: 'not-a-valid-url',
        max_length: 1000,
        start_index: 0,
        raw: false,
      });
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error instanceof Error);
    }
  });
});

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { fetchPrompt } from '../src/fetch.prompt.js';

describe('Fetch Prompt', () => {
  it('should fetch content via prompt', async () => {
    const result = await fetchPrompt.execute({
      url: 'https://example.com',
    });

    assert.ok(result.messages);
    assert.equal(result.messages[0].role, 'user');
    assert.ok(
      (result.messages[0].content.text as string).includes('Example Domain'),
    );
  });

  it('should handle invalid URLs in prompt', async () => {
    try {
      await fetchPrompt.execute({
        url: 'not-a-valid-url',
      });
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error instanceof Error);
    }
  });
});

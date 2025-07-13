import {
  getButtonPosition,
  getInlineButtonPosition,
  findNumber
} from '../src/parser';
import { MockTFile, MockMarkdownView, createMockApp, createMockFile, createMockView } from './setup';
import { Arguments } from '../src/types';

// Mock the utils module
jest.mock('../src/utils', () => ({
  createContentArray: jest.fn(),
}));

describe('Parser', () => {
  let mockApp: any;
  let mockFile: MockTFile;
  let mockView: MockMarkdownView;

  beforeEach(() => {
    mockApp = createMockApp();
    mockFile = createMockFile();
    mockView = createMockView(mockFile);
    
    jest.clearAllMocks();
  });

  describe('getButtonPosition', () => {
    it('should find button position in content', () => {
      const content = `Some text
\`\`\`button
name My Button
type command
\`\`\`
More text`;
      
      const args: Arguments = { name: 'My Button' };
      
      const result = getButtonPosition(content, args);
      
      expect(result).toEqual({
        lineStart: 1,
        lineEnd: 4
      });
    });

    it('should find correct button when multiple buttons exist', () => {
      const content = `Some text
\`\`\`button
name First Button
type command
\`\`\`
More text
\`\`\`button
name Second Button
type link
\`\`\`
Even more text`;
      
      const args: Arguments = { name: 'Second Button' };
      
      const result = getButtonPosition(content, args);
      
      expect(result).toEqual({
        lineStart: 6,
        lineEnd: 9
      });
    });

    it('should return undefined for non-existent button', () => {
      const content = `Some text
\`\`\`button
name My Button
type command
\`\`\`
More text`;
      
      const args: Arguments = { name: 'Non-existent Button' };
      
      const result = getButtonPosition(content, args);
      
      expect(result).toBeUndefined();
    });

    it('should handle empty content', () => {
      const content = '';
      const args: Arguments = { name: 'My Button' };
      
      const result = getButtonPosition(content, args);
      
      expect(result).toBeUndefined();
    });

    it('should handle malformed button blocks', () => {
      const content = `Some text
\`\`\`button
name My Button
type command
Missing closing backticks
More text`;
      
      const args: Arguments = { name: 'My Button' };
      
      const result = getButtonPosition(content, args);
      
      expect(result).toBeUndefined();
    });

    it('should handle multiple code blocks including non-button blocks', () => {
      const content = `Some text
\`\`\`javascript
console.log('Hello');
\`\`\`
More text
\`\`\`button
name My Button
type command
\`\`\`
Even more text`;
      
      const args: Arguments = { name: 'My Button' };
      
      const result = getButtonPosition(content, args);
      
      expect(result).toEqual({
        lineStart: 5,
        lineEnd: 8
      });
    });

    it('should handle nested backticks', () => {
      const content = `Some text
\`\`\`button
name My Button
type command
action \`some code\`
\`\`\`
More text`;
      
      const args: Arguments = { name: 'My Button' };
      
      const result = getButtonPosition(content, args);
      
      expect(result).toEqual({
        lineStart: 1,
        lineEnd: 5
      });
    });
  });

  describe('getInlineButtonPosition', () => {
    it('should find inline button position', async () => {
      const id = 'test-button';
      const contentArray = [
        'Some text',
        'This line has a `button-test-button` inline button',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await getInlineButtonPosition(mockApp, id);
      
      expect(result).toEqual({
        lineStart: 1,
        lineEnd: 1
      });
    });

    it('should find multiple inline buttons and return correct one', async () => {
      const id = 'second-button';
      const contentArray = [
        'Some text with `button-first-button`',
        'This line has a `button-second-button` inline button',
        'More text with `button-third-button`'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await getInlineButtonPosition(mockApp, id);
      
      expect(result).toEqual({
        lineStart: 1,
        lineEnd: 1
      });
    });

    it('should return default position when button not found', async () => {
      const id = 'non-existent-button';
      const contentArray = [
        'Some text',
        'This line has a `button-different-button` inline button',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await getInlineButtonPosition(mockApp, id);
      
      expect(result).toEqual({
        lineStart: 0,
        lineEnd: 0
      });
    });

    it('should handle empty content array', async () => {
      const id = 'test-button';
      const contentArray: string[] = [];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await getInlineButtonPosition(mockApp, id);
      
      expect(result).toEqual({
        lineStart: 0,
        lineEnd: 0
      });
    });

    it('should handle multiple buttons on same line', async () => {
      const id = 'second-button';
      const contentArray = [
        'Some text',
        'This line has `button-first-button` and `button-second-button` buttons',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await getInlineButtonPosition(mockApp, id);
      
      expect(result).toEqual({
        lineStart: 1,
        lineEnd: 1
      });
    });

    it('should handle button at beginning of line', async () => {
      const id = 'start-button';
      const contentArray = [
        'Some text',
        '`button-start-button` at the beginning of line',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await getInlineButtonPosition(mockApp, id);
      
      expect(result).toEqual({
        lineStart: 1,
        lineEnd: 1
      });
    });
  });

  describe('findNumber', () => {
    it('should find numbers in specified line', async () => {
      const lineNumber = 2;
      const contentArray = [
        'Some text',
        'Line with number 42 and another 123',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      expect(result).toEqual(['42', '123']);
    });

    it('should handle line with no numbers', async () => {
      const lineNumber = 2;
      const contentArray = [
        'Some text',
        'Line with no numbers',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      expect(result).toBeNull();
    });

    it('should convert word operators to symbols', async () => {
      const lineNumber = 2;
      const contentArray = [
        'Some text',
        'Calculate 5 plus 3 minus 1 times 2 divided by 4',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      // The function should convert words to operators and then extract numbers
      expect(result).toEqual(['5', '3', '1', '2', '4']);
    });

    it('should handle negative numbers', async () => {
      const lineNumber = 2;
      const contentArray = [
        'Some text',
        'Numbers: -42 and +123',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      expect(result).toEqual(['-42', '+123']);
    });

    it('should handle decimal numbers', async () => {
      const lineNumber = 2;
      const contentArray = [
        'Some text',
        'Decimal numbers: 3.14 and 2.5',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      expect(result).toEqual(['3', '14', '2', '5']);
    });

    it('should handle line number out of bounds', async () => {
      const lineNumber = 10; // Beyond array length
      const contentArray = [
        'Some text',
        'Line with number 42',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      expect(result).toBeNull();
    });

    it('should handle empty content array', async () => {
      const lineNumber = 1;
      const contentArray: string[] = [];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      expect(result).toBeNull();
    });

    it('should handle line with only spaces', async () => {
      const lineNumber = 2;
      const contentArray = [
        'Some text',
        '    ',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      expect(result).toBeNull();
    });

    it('should handle word operators variations', async () => {
      const lineNumber = 2;
      const contentArray = [
        'Some text',
        'Calculate 10 divide by 2 and 6 divided by 3',
        'More text'
      ];
      
      const createContentArray = require('../src/utils').createContentArray;
      createContentArray.mockResolvedValue({
        contentArray,
        file: mockFile
      });
      
      const result = await findNumber(mockApp, lineNumber);
      
      expect(result).toEqual(['10', '2', '6', '3']);
    });
  });
});
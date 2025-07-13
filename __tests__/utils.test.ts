import { 
  createArgumentObject, 
  createContentArray, 
  handleValueArray, 
  getNewArgs, 
  wrapAround,
  insertButton,
  insertInlineButton,
  runTemplater
} from '../src/utils';
import { MockTFile, MockMarkdownView, createMockApp, createMockFile, createMockView } from './setup';
import { Arguments } from '../src/types';

describe('Utils', () => {
  let mockApp: any;
  let mockFile: MockTFile;
  let mockView: MockMarkdownView;

  beforeEach(() => {
    mockApp = createMockApp();
    mockFile = createMockFile();
    mockView = createMockView(mockFile);
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('createArgumentObject', () => {
    it('should create an argument object from button source', () => {
      const source = `name My Button
type command
action Toggle Pin
class custom-class
color blue`;

      const result = createArgumentObject(source);

      expect(result).toEqual({
        name: 'My Button',
        type: 'command',
        action: 'Toggle Pin',
        class: 'custom-class',
        color: 'blue'
      });
    });

    it('should handle empty source', () => {
      const result = createArgumentObject('');
      expect(result).toEqual({});
    });

    it('should handle malformed source', () => {
      const source = 'name';
      const result = createArgumentObject(source);
      expect(result).toEqual({ name: '' });
    });

    it('should handle multi-word values', () => {
      const source = 'name This is a long button name\naction Do something complex';
      const result = createArgumentObject(source);
      expect(result).toEqual({
        name: 'This is a long button name',
        action: 'Do something complex'
      });
    });
  });

  describe('createContentArray', () => {
    it('should create content array from active view', async () => {
      const fileContent = 'Line 1\nLine 2\nLine 3';
      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);
      mockApp.vault.read.mockResolvedValue(fileContent);

      const result = await createContentArray(mockApp);

      expect(result).toEqual({
        contentArray: ['Line 1', 'Line 2', 'Line 3'],
        file: mockFile
      });
      expect(mockApp.workspace.getActiveViewOfType).toHaveBeenCalledWith(expect.any(Function));
      expect(mockApp.vault.read).toHaveBeenCalledWith(mockFile);
    });

    it('should handle no active view', async () => {
      mockApp.workspace.getActiveViewOfType.mockReturnValue(null);

      const result = await createContentArray(mockApp);

      expect(result).toBeUndefined();
      expect(mockApp.workspace.getActiveViewOfType).toHaveBeenCalled();
    });
  });

  describe('handleValueArray', () => {
    it('should handle array notation and call callback', () => {
      const callback = jest.fn();
      const value = '[button1, button2, button3]';

      handleValueArray(value, callback);

      expect(callback).toHaveBeenCalledWith(['button1', 'button2', 'button3']);
    });

    it('should handle array with spaces', () => {
      const callback = jest.fn();
      const value = '[button1,button2,button3]';

      handleValueArray(value, callback);

      expect(callback).toHaveBeenCalledWith(['button1', 'button2', 'button3']);
    });

    it('should not call callback for invalid format', () => {
      const callback = jest.fn();
      const value = 'invalid format';

      handleValueArray(value, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle empty array', () => {
      const callback = jest.fn();
      const value = '[]';

      handleValueArray(value, callback);

      expect(callback).toHaveBeenCalledWith(['']);
    });
  });

  describe('getNewArgs', () => {
    it('should extract arguments from button position', async () => {
      const position = { lineStart: 1, lineEnd: 4 };
      const fileContent = `Line 0
\`\`\`button
name Test Button
type command
action Toggle Pin
\`\`\`
Line 5`;

      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);
      mockApp.vault.cachedRead.mockResolvedValue(fileContent);

      const result = await getNewArgs(mockApp, position);

      expect(result.args).toEqual({
        name: 'Test Button',
        type: 'command',
        action: 'Toggle Pin'
      });
    });
  });

  describe('wrapAround', () => {
    it('should wrap positive values correctly', () => {
      expect(wrapAround(0, 5)).toBe(0);
      expect(wrapAround(4, 5)).toBe(4);
      expect(wrapAround(5, 5)).toBe(0);
      expect(wrapAround(7, 5)).toBe(2);
    });

    it('should wrap negative values correctly', () => {
      expect(wrapAround(-1, 5)).toBe(4);
      expect(wrapAround(-2, 5)).toBe(3);
      expect(wrapAround(-6, 5)).toBe(4);
    });

    it('should handle zero size', () => {
      expect(wrapAround(5, 0)).toBe(NaN);
    });
  });

  describe('insertButton', () => {
    it('should insert button markdown with all properties', () => {
      const outputObject = {
        name: 'Test Button',
        type: 'command',
        action: 'Toggle Pin',
        id: 'test-id',
        swap: '[btn1, btn2]',
        remove: 'true',
        replace: '[1,5]',
        templater: true,
        color: 'blue',
        customColor: '#ff0000',
        customTextColor: '#ffffff',
        class: 'custom-class',
        folder: 'buttons',
        prompt: true,
        blockId: 'test-block'
      };

      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);

      insertButton(mockApp, outputObject);

      const expectedButton = `\`\`\`button
name Test Button
type command
action Toggle Pin
id test-id
swap [btn1, btn2]
remove true
replace [1,5]
templater true
color blue
customColor #ff0000
customTextColor #ffffff
class custom-class
folder buttons
prompt true
\`\`\`
^button-test-block`;

      expect(mockView.editor.replaceSelection).toHaveBeenCalledWith(expectedButton);
    });

    it('should generate random ID when blockId is not provided', () => {
      const outputObject = {
        name: 'Test Button',
        type: 'command',
        action: 'Toggle Pin',
        id: '',
        swap: '',
        remove: '',
        replace: '',
        templater: false,
        color: '',
        customColor: '',
        customTextColor: '',
        class: '',
        folder: '',
        prompt: false,
        blockId: ''
      };

      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);

      insertButton(mockApp, outputObject);

      expect(mockView.editor.replaceSelection).toHaveBeenCalledWith(expect.stringContaining('^button-'));
    });
  });

  describe('insertInlineButton', () => {
    it('should insert inline button markdown', () => {
      const id = 'test-id';
      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);

      insertInlineButton(mockApp, id);

      expect(mockView.editor.replaceSelection).toHaveBeenCalledWith('`button-test-id`');
    });
  });

  describe('runTemplater', () => {
    it('should run templater and return file content', async () => {
      const mockFile = createMockFile();
      const mockContent = 'processed content';
      const mockRef = { event: 'templater:overwrite-file', callback: jest.fn() };

      mockApp.workspace.on.mockReturnValue(mockRef);
      mockApp.commands.executeCommandById.mockImplementation(() => {
        // Simulate templater event
        setTimeout(() => {
          const callback = mockApp.workspace.on.mock.calls[0][1];
          callback(mockFile, mockContent);
        }, 0);
      });

      const result = await runTemplater(mockApp);

      expect(result).toEqual({
        file: mockFile,
        content: mockContent
      });
      expect(mockApp.workspace.on).toHaveBeenCalledWith('templater:overwrite-file', expect.any(Function));
      expect(mockApp.commands.executeCommandById).toHaveBeenCalledWith('templater-obsidian:replace-in-file-templater');
      expect(mockApp.workspace.offref).toHaveBeenCalledWith(mockRef);
    });
  });
});
import {
  getStore,
  initializeButtonStore,
  addButtonToStore,
  getButtonFromStore,
  getButtonById,
  getButtonSwapById,
  setButtonSwapById,
  buildButtonArray
} from '../src/buttonStore';
import { MockTFile, MockEvents, createMockApp, createMockFile } from './setup';
import { ExtendedBlockCache } from '../src/types';

describe('ButtonStore', () => {
  let mockApp: any;
  let mockFile: MockTFile;
  let mockEvents: MockEvents;
  let mockCache: any;

  beforeEach(() => {
    mockApp = createMockApp();
    mockFile = createMockFile();
    mockEvents = new MockEvents();
    
    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    
    // Mock cache
    mockCache = {
      blocks: {
        'button-test1': {
          id: 'button-test1',
          position: {
            start: { line: 1, ch: 0 },
            end: { line: 3, ch: 0 }
          }
        },
        'button-test2': {
          id: 'button-test2',
          position: {
            start: { line: 5, ch: 0 },
            end: { line: 7, ch: 0 }
          }
        }
      }
    };
    
    jest.clearAllMocks();
  });

  describe('getStore', () => {
    it('should return button store from localStorage for desktop', () => {
      const mockButtons = [
        { id: 'button-test1', path: 'test.md' },
        { id: 'button-test2', path: 'test.md' }
      ];
      
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockButtons));
      
      const result = getStore(false);
      
      expect(result).toEqual(mockButtons);
      expect(localStorage.getItem).toHaveBeenCalledWith('buttons');
    });

    it('should return button store from memory for mobile', () => {
      const mockButtons = [
        { id: 'button-test1', path: 'test.md' }
      ];
      
      // Set up the buttonStore in memory (simulate mobile)
      initializeButtonStore(mockApp, mockEvents);
      
      const result = getStore(true);
      
      expect(result).toBeDefined();
    });
  });

  describe('initializeButtonStore', () => {
    it('should initialize button store with markdown files', () => {
      const mockFiles = [mockFile];
      mockApp.vault.getMarkdownFiles.mockReturnValue(mockFiles);
      mockApp.metadataCache.getFileCache.mockReturnValue(mockCache);
      
      initializeButtonStore(mockApp, mockEvents);
      
      expect(mockApp.vault.getMarkdownFiles).toHaveBeenCalled();
      expect(mockApp.metadataCache.getFileCache).toHaveBeenCalledWith(mockFile);
      expect(localStorage.setItem).toHaveBeenCalledWith('buttons', expect.any(String));
    });

    it('should trigger index-complete event', () => {
      const mockFiles = [mockFile];
      mockApp.vault.getMarkdownFiles.mockReturnValue(mockFiles);
      mockApp.metadataCache.getFileCache.mockReturnValue(mockCache);
      
      const triggerSpy = jest.spyOn(mockEvents, 'trigger');
      
      initializeButtonStore(mockApp, mockEvents);
      
      expect(triggerSpy).toHaveBeenCalledWith('index-complete');
    });
  });

  describe('addButtonToStore', () => {
    it('should add new buttons to store', () => {
      const existingButtons = [
        { id: 'button-existing', path: 'other.md', position: { start: { line: 0 }, end: { line: 1 } } }
      ];
      
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(existingButtons));
      mockApp.metadataCache.getFileCache.mockReturnValue(mockCache);
      
      addButtonToStore(mockApp, mockFile);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('buttons', expect.any(String));
      
      const setItemCall = (localStorage.setItem as jest.Mock).mock.calls[0][1];
      const storedButtons = JSON.parse(setItemCall);
      
      expect(storedButtons).toHaveLength(3); // 1 existing + 2 new
      expect(storedButtons.some((b: any) => b.id === 'button-test1')).toBe(true);
      expect(storedButtons.some((b: any) => b.id === 'button-test2')).toBe(true);
    });

    it('should handle empty cache', () => {
      mockApp.metadataCache.getFileCache.mockReturnValue(null);
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([]));
      
      addButtonToStore(mockApp, mockFile);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('buttons', '[]');
    });

    it('should remove duplicates', () => {
      const existingButtons = [
        { id: 'button-test1', path: 'test.md', position: { start: { line: 1 }, end: { line: 3 } } }
      ];
      
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(existingButtons));
      mockApp.metadataCache.getFileCache.mockReturnValue(mockCache);
      
      addButtonToStore(mockApp, mockFile);
      
      const setItemCall = (localStorage.setItem as jest.Mock).mock.calls[0][1];
      const storedButtons = JSON.parse(setItemCall);
      
      // Should not have duplicates
      const test1Buttons = storedButtons.filter((b: any) => b.id === 'button-test1');
      expect(test1Buttons).toHaveLength(1);
    });
  });

  describe('getButtonFromStore', () => {
    it('should get button from store by ID', async () => {
      const mockButtons = [
        { id: 'button-test1', path: 'test.md', position: { start: { line: 1 }, end: { line: 3 } } }
      ];
      
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockButtons));
      mockApp.vault.getAbstractFileByPath.mockReturnValue(mockFile);
      mockApp.vault.cachedRead.mockResolvedValue(`Line 0
\`\`\`button
name Test Button
type command
\`\`\`
Line 4`);
      
      const args = { id: 'test1' };
      const result = await getButtonFromStore(mockApp, args);
      
      expect(result).toEqual({
        args: { name: 'Test Button', type: 'command', id: 'test1' },
        id: 'test1'
      });
    });

    it('should return undefined for non-existent button', async () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([]));
      
      const args = { id: 'nonexistent' };
      const result = await getButtonFromStore(mockApp, args);
      
      expect(result).toBeUndefined();
    });

    it('should return undefined if no ID provided', async () => {
      const args = {};
      const result = await getButtonFromStore(mockApp, args);
      
      expect(result).toBeUndefined();
    });
  });

  describe('getButtonById', () => {
    it('should get button arguments by ID', async () => {
      const mockButtons = [
        { id: 'button-test1', path: 'test.md', position: { start: { line: 1 }, end: { line: 3 } } }
      ];
      
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockButtons));
      mockApp.vault.getAbstractFileByPath.mockReturnValue(mockFile);
      mockApp.vault.cachedRead.mockResolvedValue(`Line 0
\`\`\`button
name Test Button
type command
\`\`\`
Line 4`);
      
      const result = await getButtonById(mockApp, 'test1');
      
      expect(result).toEqual({
        name: 'Test Button',
        type: 'command'
      });
    });

    it('should return undefined for non-existent button', async () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([]));
      
      const result = await getButtonById(mockApp, 'nonexistent');
      
      expect(result).toBeUndefined();
    });
  });

  describe('getButtonSwapById', () => {
    it('should get button swap value by ID', async () => {
      const mockButtons = [
        { id: 'button-test1', path: 'test.md', swap: 2 }
      ];
      
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockButtons));
      
      const result = await getButtonSwapById(mockApp, 'test1');
      
      expect(result).toBe(2);
    });

    it('should return undefined for non-existent button', async () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([]));
      
      const result = await getButtonSwapById(mockApp, 'nonexistent');
      
      expect(result).toBeUndefined();
    });
  });

  describe('setButtonSwapById', () => {
    it('should set button swap value by ID', async () => {
      const mockButtons = [
        { id: 'button-test1', path: 'test.md', swap: 0 }
      ];
      
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockButtons));
      
      await setButtonSwapById(mockApp, 'test1', 3);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('buttons', expect.any(String));
      
      const setItemCall = (localStorage.setItem as jest.Mock).mock.calls[0][1];
      const storedButtons = JSON.parse(setItemCall);
      const updatedButton = storedButtons.find((b: any) => b.id === 'button-test1');
      
      expect(updatedButton.swap).toBe(3);
    });

    it('should handle non-existent button', async () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([]));
      
      await setButtonSwapById(mockApp, 'nonexistent', 3);
      
      // Should not crash or throw
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('buildButtonArray', () => {
    it('should build button array from cache', () => {
      const result = buildButtonArray(mockCache, mockFile);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'button-test1',
        position: { start: { line: 1, ch: 0 }, end: { line: 3, ch: 0 } },
        path: 'test.md',
        swap: 0
      });
      expect(result[1]).toEqual({
        id: 'button-test2',
        position: { start: { line: 5, ch: 0 }, end: { line: 7, ch: 0 } },
        path: 'test.md',
        swap: 0
      });
    });

    it('should return undefined for null cache', () => {
      const result = buildButtonArray(null, mockFile);
      
      expect(result).toBeUndefined();
    });

    it('should return undefined for cache without blocks', () => {
      const emptyCache = {};
      const result = buildButtonArray(emptyCache, mockFile);
      
      expect(result).toBeUndefined();
    });

    it('should filter out non-button blocks', () => {
      const mixedCache = {
        blocks: {
          'button-test1': {
            id: 'button-test1',
            position: { start: { line: 1, ch: 0 }, end: { line: 3, ch: 0 } }
          },
          'code-block': {
            id: 'code-block',
            position: { start: { line: 5, ch: 0 }, end: { line: 7, ch: 0 } }
          }
        }
      };
      
             const result = buildButtonArray(mixedCache, mockFile);
       
       expect(result).toHaveLength(1);
       expect((result[0] as any).id).toBe('button-test1');
    });
  });
});
import {
  calculate,
  remove,
  replace,
  text,
  template,
  link,
  copy,
  command,
  swap
} from '../src/buttonTypes';
import { MockTFile, MockMarkdownView, createMockApp, createMockFile, createMockView } from './setup';
import { Arguments, Position } from '../src/types';
import mexp from 'math-expression-evaluator';

// Mock the handlers module
jest.mock('../src/handlers', () => ({
  appendContent: jest.fn(),
  createNote: jest.fn(),
  prependContent: jest.fn(),
  addContentAtLine: jest.fn(),
  removeButton: jest.fn(),
  removeSection: jest.fn(),
}));

// Mock the parser module
jest.mock('../src/parser', () => ({
  getButtonPosition: jest.fn(),
  getInlineButtonPosition: jest.fn(),
  findNumber: jest.fn(),
}));

// Mock the button store
jest.mock('../src/buttonStore', () => ({
  getButtonSwapById: jest.fn(),
  setButtonSwapById: jest.fn(),
  getButtonById: jest.fn(),
}));

// Mock the templater
jest.mock('../src/templater', () => ({
  processTemplate: jest.fn(),
}));

describe('ButtonTypes', () => {
  let mockApp: any;
  let mockFile: MockTFile;
  let mockView: MockMarkdownView;

  beforeEach(() => {
    mockApp = createMockApp();
    mockFile = createMockFile();
    mockView = createMockView(mockFile);
    
    // Mock Notice constructor to avoid errors
    global.Notice = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('calculate', () => {
    it('should perform basic calculation', async () => {
      const args: Arguments = { action: '2+2' };
      const position: Position = { lineStart: 0, lineEnd: 2 };
      
      const appendContent = require('../src/handlers').appendContent;
      
      await calculate(mockApp, args, position);
      
      expect(appendContent).toHaveBeenCalledWith(mockApp, 'Result: 4', 2);
    });

    it('should handle calculations with variables', async () => {
      const args: Arguments = { action: '$1+$2' };
      const position: Position = { lineStart: 0, lineEnd: 2 };
      
      const findNumber = require('../src/parser').findNumber;
      const appendContent = require('../src/handlers').appendContent;
      
      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);
      findNumber.mockResolvedValueOnce(['5']).mockResolvedValueOnce(['3']);
      
      (mexp.eval as jest.Mock).mockReturnValue(8);
      
      await calculate(mockApp, args, position);
      
      expect(findNumber).toHaveBeenCalledWith(mockApp, 1);
      expect(findNumber).toHaveBeenCalledWith(mockApp, 2);
      expect(appendContent).toHaveBeenCalledWith(mockApp, 'Result: 8', 2);
    });

    it('should handle invalid variables', async () => {
      const args: Arguments = { action: '$1+$2' };
      const position: Position = { lineStart: 0, lineEnd: 2 };
      
      const findNumber = require('../src/parser').findNumber;
      const appendContent = require('../src/handlers').appendContent;
      
      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);
      findNumber.mockResolvedValueOnce(null).mockResolvedValueOnce(['3']);
      
      await calculate(mockApp, args, position);
      
      expect(appendContent).not.toHaveBeenCalled();
      expect(global.Notice).toHaveBeenCalledWith('Check the line number in your calculate button', 3000);
    });

    it('should handle no active view', async () => {
      const args: Arguments = { action: '$1+$2' };
      const position: Position = { lineStart: 0, lineEnd: 2 };
      
      mockApp.workspace.getActiveViewOfType.mockReturnValue(null);
      
      await calculate(mockApp, args, position);
      
      expect(global.Notice).toHaveBeenCalledWith("couldn't read file", 2000);
    });
  });

  describe('remove', () => {
    it('should call removeButton with correct arguments', async () => {
      const args: Arguments = { remove: 'true' };
      const position = { lineStart: 1, lineEnd: 3 };
      
      const removeButton = require('../src/handlers').removeButton;
      
      await remove(mockApp, args, position);
      
      expect(removeButton).toHaveBeenCalledWith(mockApp, 'true', 1, 3);
    });
  });

  describe('replace', () => {
    it('should call removeSection with correct arguments', async () => {
      const args: Arguments = { replace: '[1,5]' };
      
      const removeSection = require('../src/handlers').removeSection;
      
      await replace(mockApp, args);
      
      expect(removeSection).toHaveBeenCalledWith(mockApp, '[1,5]');
    });
  });

  describe('text', () => {
    it('should handle prepend text', async () => {
      const args: Arguments = { type: 'text prepend', action: 'Hello World' };
      const position: Position = { lineStart: 1, lineEnd: 3 };
      
      const prependContent = require('../src/handlers').prependContent;
      
      await text(mockApp, args, position);
      
      expect(prependContent).toHaveBeenCalledWith(mockApp, 'Hello World', 1, false);
    });

    it('should handle append text', async () => {
      const args: Arguments = { type: 'text append', action: 'Hello World' };
      const position: Position = { lineStart: 1, lineEnd: 3 };
      
      const appendContent = require('../src/handlers').appendContent;
      
      await text(mockApp, args, position);
      
      expect(appendContent).toHaveBeenCalledWith(mockApp, 'Hello World', 3, false);
    });

    it('should handle note creation', async () => {
      const args: Arguments = { type: 'text note', action: 'content', folder: 'notes', prompt: 'true' };
      const position: Position = { lineStart: 1, lineEnd: 3 };
      
      const createNote = require('../src/handlers').createNote;
      
      await text(mockApp, args, position);
      
      expect(createNote).toHaveBeenCalledWith(mockApp, 'text note', 'notes', 'true', 'content', false);
    });

    it('should handle line insertion', async () => {
      const args: Arguments = { type: 'text line(5)', action: 'Hello World' };
      const position: Position = { lineStart: 1, lineEnd: 3 };
      
      const addContentAtLine = require('../src/handlers').addContentAtLine;
      
      await text(mockApp, args, position);
      
      expect(addContentAtLine).toHaveBeenCalledWith(mockApp, 'Hello World', 'text line(5)', false);
    });
  });

  describe('template', () => {
    it('should handle template with core templates enabled', async () => {
      const args: Arguments = { type: 'template prepend', action: 'mytemplate' };
      const position: Position = { lineStart: 1, lineEnd: 3 };
      
      mockApp.internalPlugins.plugins.templates.enabled = true;
      mockApp.internalPlugins.plugins.templates.instance.options.folder = 'templates';
      mockApp.vault.getFiles.mockReturnValue([
        { path: 'templates/mytemplate.md', name: 'mytemplate.md' }
      ]);
      
      const prependContent = require('../src/handlers').prependContent;
      
      await template(mockApp, args, position);
      
      expect(prependContent).toHaveBeenCalledWith(
        mockApp,
        { path: 'templates/mytemplate.md', name: 'mytemplate.md' },
        1,
        false
      );
    });

    it('should handle template with templater enabled', async () => {
      const args: Arguments = { type: 'template append', action: 'mytemplate' };
      const position: Position = { lineStart: 1, lineEnd: 3 };
      
      mockApp.internalPlugins.plugins.templates.enabled = false;
      mockApp.plugins.plugins['templater-obsidian'] = {
        settings: { templates_folder: 'templates' }
      };
      mockApp.vault.getFiles.mockReturnValue([
        { path: 'templates/mytemplate.md', name: 'mytemplate.md' }
      ]);
      
      const appendContent = require('../src/handlers').appendContent;
      
      await template(mockApp, args, position);
      
      expect(appendContent).toHaveBeenCalledWith(
        mockApp,
        { path: 'templates/mytemplate.md', name: 'mytemplate.md' },
        3,
        true
      );
    });

    it('should show notice when template not found', async () => {
      const args: Arguments = { type: 'template prepend', action: 'nonexistent' };
      const position: Position = { lineStart: 1, lineEnd: 3 };
      
      mockApp.internalPlugins.plugins.templates.enabled = true;
      mockApp.vault.getFiles.mockReturnValue([]);
      
      await template(mockApp, args, position);
      
      expect(global.Notice).toHaveBeenCalledWith(
        "Couldn't find the specified template, please check and try again",
        2000
      );
    });

    it('should show notice when no template plugin enabled', async () => {
      const args: Arguments = { type: 'template prepend', action: 'mytemplate' };
      const position: Position = { lineStart: 1, lineEnd: 3 };
      
      mockApp.internalPlugins.plugins.templates.enabled = false;
      mockApp.plugins.plugins['templater-obsidian'] = null;
      
      await template(mockApp, args, position);
      
      expect(global.Notice).toHaveBeenCalledWith(
        'You need to have the Templates or Templater plugin enabled and Template folder defined',
        2000
      );
    });
  });

  describe('link', () => {
    it('should open link in new window', () => {
      const args: Arguments = { action: 'https://example.com' };
      
      link(args);
      
      expect(window.open).toHaveBeenCalledWith('https://example.com');
    });

    it('should trim whitespace from link', () => {
      const args: Arguments = { action: '  https://example.com  ' };
      
      link(args);
      
      expect(window.open).toHaveBeenCalledWith('https://example.com');
    });
  });

  describe('copy', () => {
    it('should copy text to clipboard', () => {
      const args: Arguments = { action: 'Hello World' };
      
      copy(args);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World');
    });
  });

  describe('command', () => {
    it('should execute command', () => {
      const args: Arguments = { action: 'Toggle Pin', type: 'command' };
      const buttonStart = { lineStart: 1, lineEnd: 3 };
      
      const mockCommands = [
        { id: 'pin-toggle', name: 'Toggle Pin' }
      ];
      
      mockApp.commands.listCommands.mockReturnValue(mockCommands);
      
      command(mockApp, args, buttonStart);
      
      expect(mockApp.commands.executeCommandById).toHaveBeenCalledWith('pin-toggle');
    });

    it('should handle command with prepend', () => {
      const args: Arguments = { action: 'Toggle Pin', type: 'command prepend' };
      const buttonStart = { lineStart: 1, lineEnd: 3 };
      
      const mockCommands = [
        { id: 'pin-toggle', name: 'Toggle Pin' }
      ];
      
      mockApp.commands.listCommands.mockReturnValue(mockCommands);
      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);
      
      command(mockApp, args, buttonStart);
      
      expect(mockView.editor.setCursor).toHaveBeenCalledWith(1, 0);
      expect(mockApp.commands.executeCommandById).toHaveBeenCalledWith('pin-toggle');
    });

    it('should handle command with append', () => {
      const args: Arguments = { action: 'Toggle Pin', type: 'command append' };
      const buttonStart = { lineStart: 1, lineEnd: 3 };
      
      const mockCommands = [
        { id: 'pin-toggle', name: 'Toggle Pin' }
      ];
      
      mockApp.commands.listCommands.mockReturnValue(mockCommands);
      mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);
      
      command(mockApp, args, buttonStart);
      
      expect(mockView.editor.setCursor).toHaveBeenCalledWith(5, 0);
      expect(mockApp.commands.executeCommandById).toHaveBeenCalledWith('pin-toggle');
    });
  });

  describe('swap', () => {
    it('should swap button and execute next action', async () => {
      const swapValue = '[btn1, btn2]';
      const id = 'test-button';
      const inline = true;
      const file = mockFile;
      const buttonStart = { lineStart: 1, lineEnd: 3 };
      
      const getButtonSwapById = require('../src/buttonStore').getButtonSwapById;
      const setButtonSwapById = require('../src/buttonStore').setButtonSwapById;
      const getButtonById = require('../src/buttonStore').getButtonById;
      
      getButtonSwapById.mockResolvedValue(0);
      getButtonById.mockResolvedValue({
        name: 'Button 1',
        type: 'command',
        action: 'Toggle Pin'
      });
      
      mockApp.commands.listCommands.mockReturnValue([
        { id: 'pin-toggle', name: 'Toggle Pin' }
      ]);
      
      await swap(mockApp, swapValue, id, inline, file, buttonStart);
      
      expect(getButtonSwapById).toHaveBeenCalledWith(mockApp, id);
      expect(setButtonSwapById).toHaveBeenCalledWith(mockApp, id, 1);
      expect(getButtonById).toHaveBeenCalledWith(mockApp, 'btn1');
      expect(mockApp.commands.executeCommandById).toHaveBeenCalledWith('pin-toggle');
    });

    it('should wrap around to beginning when at end', async () => {
      const swapValue = '[btn1, btn2]';
      const id = 'test-button';
      const inline = true;
      const file = mockFile;
      const buttonStart = { lineStart: 1, lineEnd: 3 };
      
      const getButtonSwapById = require('../src/buttonStore').getButtonSwapById;
      const setButtonSwapById = require('../src/buttonStore').setButtonSwapById;
      const getButtonById = require('../src/buttonStore').getButtonById;
      
      getButtonSwapById.mockResolvedValue(1); // At end of array
      getButtonById.mockResolvedValue({
        name: 'Button 2',
        type: 'link',
        action: 'https://example.com'
      });
      
      await swap(mockApp, swapValue, id, inline, file, buttonStart);
      
      expect(setButtonSwapById).toHaveBeenCalledWith(mockApp, id, 0); // Wrap to beginning
      expect(getButtonById).toHaveBeenCalledWith(mockApp, 'btn2');
      expect(window.open).toHaveBeenCalledWith('https://example.com');
    });
  });
});
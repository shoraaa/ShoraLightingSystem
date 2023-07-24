# Copyright (c) 2013 Rubiks Software Corporation 
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
# and associated documentation files (the "Software"), to deal in the Software without restriction, 
# including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
# and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
include Java
require 'date'

import javax.swing.JFrame
import javax.swing.JPanel
import javax.swing.JButton
import javax.swing.JLabel
import javax.swing.JFileChooser
import javax.swing.JOptionPane
import javax.swing.JTextField
import javax.swing.JTextArea
import javax.swing.JScrollPane
import javax.swing.text.DefaultCaret

import javax.swing.ScrollPaneConstants

import java.awt.event.ActionListener

#included for the listener

import java.nio.file.FileSystems
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardWatchEventKinds
import java.io.IOException


class JSCombiner < JFrame

	attr_accessor :directory_path
	attr_accessor :base_filename
	attr_accessor :base_directory
	attr_accessor :sub_directory
	attr_accessor :output_javascript

	include ActionListener
  
    def initialize
        super "JSCombiner"
		self.base_filename = File.basename(__FILE__, File.extname(__FILE__)) #=> "filename"
		self.base_directory = __dir__
		self.sub_directory = self.base_directory + "/_" + self.base_filename + " sub components"
		self.output_javascript = self.base_filename + ".js"
        
        self.initUI
    end
      
    def initUI
        
		panel = JPanel.new
		self.getContentPane.add panel
		
		panel.setLayout nil
		panel.setToolTipText "A Panel container"

		label1 = JLabel.new "Directory to add"	
		label1.setBounds 5,60,100,20
		panel.add label1

		label2 = JLabel.new "Output script"
		label2.setBounds 5, 20, 100, 20
		panel.add label2
	
		@fileTextField = JTextField.new "", 100
		@fileTextField.setBounds 100,55,150,30
		@fileTextField.setEditable false
		panel.add @fileTextField
		
		@outputScriptTextField = JTextField.new self.output_javascript, 100
		@outputScriptTextField.setBounds 100, 15, 150, 30
		panel.add @outputScriptTextField
		
		@fileButton = JButton.new "Choose directory"
		@fileButton.setBounds 250,55,200,30
		@fileButton.setToolTipText "Select the directory you want to listen for changes here"	
		@fileButton.add_action_listener self
		panel.add @fileButton
		
		@forceCompileButton = JButton.new "Force Compile"
		@forceCompileButton.setBounds 250, 95, 200, 30
		@forceCompileButton.setToolTipText "Recreate the output script even if there are no changes in the file"
		@forceCompileButton.add_action_listener self
		panel.add @forceCompileButton
				
		@fileChooser = JFileChooser.new(self.sub_directory)
		@fileChooser.setFileSelectionMode JFileChooser::DIRECTORIES_ONLY
		
		@status = JTextArea.new "JSCombiner v0.1 \nhttp://rubiks.ph\n", 200, 200
		@status.setBounds 0, 0, 500, 200
		@status.setEditable false
		@status.getCaret.setUpdatePolicy DefaultCaret::ALWAYS_UPDATE
		
		scrollPane = JScrollPane.new @status
		scrollPane.setBounds 0, 150, 600, 200
		#scrollPane.setHorizontalScrollBarPolicy ScrollPaneConstants::HORIZONTAL_SCROLLBAR_NEVER
		
		panel.add scrollPane
		
		#parameters for the frame itself
        self.setSize 620, 400
        self.setDefaultCloseOperation JFrame::EXIT_ON_CLOSE
        self.setLocationRelativeTo nil
        self.setVisible true

        #initialize with subfolder parts
		self.directory_path = self.sub_directory
		@fileTextField.setText self.directory_path
		update_message "Listening for changes on #{self.directory_path}..."
		self.display_javascripts
		self.combine
		self.listen_for_changes

    end
	
	def actionPerformed(evt)
		
		if (evt.getSource == @fileButton)
			returnVal = @fileChooser.showOpenDialog self
			
			if (returnVal == JFileChooser::APPROVE_OPTION)
				directory = @fileChooser.getSelectedFile
				self.directory_path = directory.getPath
				@fileTextField.setText self.directory_path
				update_message "Listening for changes on #{self.directory_path}..."
				self.display_javascripts
				self.combine
				self.listen_for_changes
			end
		elsif (evt.getSource == @forceCompileButton)
			self.combine		
		end
	end
	
	def combine
		self.output_javascript = @outputScriptTextField.getText		
		outFile = File.new(self.base_directory + "/" + self.output_javascript, "w")
		
		iterate_javascripts { |file|
			complete_path = self.directory_path + "/" + file
			outFile.write(File.read(complete_path))
		}
		
		outFile.close
		self.update_message "Combined scripts to #{self.output_javascript}"
	end
	
	def display_javascripts
		iterate_javascripts { |file|
			self.update_message ">>>" + file
		}
	end
	
	def listen_for_changes
		#http://docs.oracle.com/javase/tutorial/essential/io/notification.html
		#translated in Ruby
		
		Thread.kill(@listenerThread) rescue nil
		
		@listenerThread = Thread.new {
			watcher = FileSystems.getDefault.newWatchService
			path = Paths.get(self.directory_path)
			begin
				key = path.register(watcher,  
					StandardWatchEventKinds::ENTRY_CREATE, 
					StandardWatchEventKinds::ENTRY_DELETE, 
					StandardWatchEventKinds::ENTRY_MODIFY)
			rescue IOException => e
				puts e.message
				puts e.backtrace.inspect
			end
			
			while true
				key = watcher.take
				key.pollEvents.each do |event|
					filename = event.context.toString

					if (filename != self.output_javascript)
						self.update_message "File " + filename + " has changed."
						self.combine
					end
				end
				key.reset
			end
		}
	end
	
	
	def update_message(string)
		@status.setText @status.getText + "\n" + DateTime.now.to_s + " " + string
	end
	
	#################################################################
	
	protected
	def iterate_javascripts 
		Dir.foreach(self.directory_path).select{|file| 
			file_parts = file.split('.')
			#do not include the output javascript
			file_parts[file_parts.length - 1] == 'js' && file != self.output_javascript
		}.each{|file|
			yield file
		}
	end
	
end


JSCombiner.new
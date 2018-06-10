#!/bin/bash
cd $HOME
mkdir .brails
git clone https://github.com/djupudga/brails.git .brails
cd .brails
npm install
npm link
# if $SHELL is zsh
#echo "PATH=$PATH:$HOME/.brails/bin" >> $HOME/.zshrc
# else assume bash
echo "Brails installed"
# echo "Paste this in your shell to use it now:"
# echo "export PATH=$PATH:$HOME/.brails/bin"

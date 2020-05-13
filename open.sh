#!/bin/bash
echo "clear" | nc -q0 -U /home/paul/socket2
echo "add" "$1" | nc -q0 -U /home/paul/socket2


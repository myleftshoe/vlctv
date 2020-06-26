#!/bin/bash
echo "---------------------------"
echo "sendcommand.sh $@"
echo $PWD
echo "$@" | nc -q0 -U ../socket


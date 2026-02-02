#!/bin/bash

if [ $# -eq 0 ]; then
    echo "No arguments supplied"
fi
    count=0
    for arg in "$@"; do
        if [ $count -lt 3 ]; then
            mkdir "$arg"
            count=$((count + 1))
        else
            break
        fi
    done
    ls -l

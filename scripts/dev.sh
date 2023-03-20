#!/bin/bash

tcm --watch src &
TCM_ID=$!

vite

trap cleanup EXIT

function cleanup() {
  [[ ! -z "$TCM_ID" ]] && kill -9 "$TCM_ID"
	exit 0
}
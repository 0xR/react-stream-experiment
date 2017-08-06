#!/bin/sh

artillery report results/16-async.json &
artillery report results/16-sync.json &
# artillery report results/15-sync.json &

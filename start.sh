#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="postgresql://neondb_owner:npg_9b2xVzACPMOj@ep-winter-band-azhei341-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
exec node node_modules/.bin/next dev -p 3000 -H 0.0.0.0

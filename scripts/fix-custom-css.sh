#!/bin/bash
cd /home/z/my-project/saintmaryrajula

BASE="src/components/school"

# 1. TeacherDetailPage.tsx
sed -i '48s/.*/    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}} className="pt-28 sm:pt-32 pb-16 lg:pb-24 bg-secondary\/30 min-h-screen">/' "$BASE/TeacherDetailPage.tsx"
# Find closing div for the wrapper - it's the last </div> before the closing fragment
# Add motion import
sed -i '1i\import { motion } from "framer-motion";' "$BASE/TeacherDetailPage.tsx"
# Close the motion.div at the end - replace last </div> with </motion.div>
# Actually let's find the line number of the last </div>
LASTDIV=$(rg -n '^    <\/div>$' "$BASE/TeacherDetailPage.tsx" | tail -1 | cut -d: -f1)
sed -i "${LASTDIV}s|<\/div>|</motion.div>|" "$BASE/TeacherDetailPage.tsx"

echo "Done TeacherDetailPage"

# For all simple animate-fade-in class replacements on plain divs,
# we can use a different approach - just remove the class and let the element appear
# since framer-motion wrapper is overkill for simple dashboard panels.

# Simpler approach: replace animate-fade-in class on divs that don't need fancy animation
# Just remove the class - elements will render normally

for file in "$BASE/NoticesEventsPage.tsx" "$BASE/AdminDashboard.tsx"; do
  sed -i 's/ animate-fade-in//g' "$file"
  echo "Cleaned $file (removed animate-fade-in classes)"
done

# TeachersPage.tsx - remove animate-fade-in-up from className
sed -i 's/ animate-fade-in-up//g' "$BASE/TeachersPage.tsx"
echo "Cleaned TeachersPage.tsx"

# Footer.tsx - remove animate-fade-in
sed -i 's/ animate-fade-in//g' "$BASE/Footer.tsx"
echo "Cleaned Footer.tsx"

echo "All simple cleanups done"
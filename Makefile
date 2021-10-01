SHELL = /bin/bash

.PHONY: generate-acknowledgements
generate-acknowledgements:
	echo -e "# Open Source Acknowledgements\n\nSpice.ai would like to acknowledge the following open source projects for making this project possible:\n\nNPM Packages\n" > ACKNOWLEDGEMENTS.md
	pushd trader && npm install && npx license-checker --csv 2>/dev/null >> ../ACKNOWLEDGEMENTS.md && popd
	pushd serverops && npm install && npx license-checker --csv 2>/dev/null >> ../ACKNOWLEDGEMENTS.md && popd


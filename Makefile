SHELL = /bin/bash

.PHONY: generate-acknowledgements
generate-acknowledgements:
	echo -e "# Open Source Acknowledgements\n\nSpice.ai would like to acknowledge the following open source projects for making this project possible:\n\nNPM Packages\n" > ACKNOWLEDGEMENTS.md
	sed -i 's/\"//g' ACKNOWLEDGEMENTS.md
	sed -i 's/,/, /g' ACKNOWLEDGEMENTS.md
	sed -i 's/,  /, /g' ACKNOWLEDGEMENTS.md

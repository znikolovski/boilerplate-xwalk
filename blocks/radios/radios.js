import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {

  /*
  <div class="sg-Radio-btnGroup sg-u-padding--x4 sg-u-noPadding--large sg-u-noPadding--medium">
    <div class="sg-Patch sg-Grid-col12--medium">
      <div class="sg-Patch-item sg-Patch-item--topLeft" style="transform: translate(-8px,-7px);">
        <img src="https://www.aami.com.au/content/dam/suncorp/insurance/aami/logos/most-popular-sash-125x125.png" alt="Most popular sash" />
      </div>
      <label class="sg-Radio sg-Radio-btn">
        <input type="radio" name="radiocheck-complexRadioButtons" class="sg-Radio-input" aria-describedby="sgdocs-dialog-button-tooltip6" />
        <i class="sg-Radio-icon"></i>
        <div class="sg-Radio-text sg-u-flex--middle">
          <div class="sg-u-paddingTop sg-u-paddingBottom">
            <i class="Icon-homeContents--dark Icon--xlarge"></i>
            <p class="sg-Type--prominent sg-u-marginTop sg-Type--size14 sg-Type--colourDark">Home &amp; Contents</p>
            <div class="sg-Type--size14 sg-u-inlineBlock">
              <ul class="sg-u-noMargin sg-List-unstyled">
                <li class=" sg-u-textCentre" id="subText_1">Covers your building and the stuff inside it</li>
              </ul>
              <div class="sg-u-textCentre sg-u-inlineBlock sg-u-noMargin">
                <p class="sg-u-inlineBlock sg-u-widthSmall">
                  <span class="  sg-Type--strikeBehind sg-u-borderWidth2 sg-u-borderText sg-Type--title sg-Type--size14 sg-u-marginTop sg-u-noMarginBottom" id="subStrikethroughText">save $50</span>
                  <span>when you buy online</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </label>
      <div class="sg-Patch-item sg-Patch-item--topRight" style="transform: translate(-8px,0px);">
        <div class="sg-u-padding">
          <div style="display: inline; position: relative;">
            <button id="sgdocs-dialog-button-tooltip6" data-target="sgdocs-dialog-tooltip6" href="#sgdocs-dialog-tooltip6" class="sg-Btn sg-Btn--medium sg-Btn--iconOnly sg-u-radiusFull sg-u-padding--x0point5 sg-u-noMargin js-openDialog" data-content-id="#radiocheck-complexRadioButtonsTooltipExample_1">
              <i class="Icon-info--default Icon--small  sg-u-imageReplacement">See full definition</i>
            </button>
            <div class="sg-Dialog sg-Dialog-tooltip sg-Dialog--lite" id="sgdocs-dialog-tooltip6" tabindex="-1" role="dialog" aria-labelledby="dialog-tooltipLabel3" aria-hidden="true">
              <div class="sg-Dialog-tooltipArrow"></div>

              <div class="sg-Dialog-content">
                <div class="sg-Dialog-header">
                  <button type="button" class="sg-Dialog-headerBtnClose sg-u-imageReplacement js-closeDialog">Close</button>
                  <h5 class="sg-Dialog-headerTitle" id="dialog-tooltipLabel3">Tooltip title</h5>
                </div>
                <div class="sg-Dialog-body">
                  <h6>Lorem ipsum</h6>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati et accusamus exercitationem libero
                    voluptas eius quod repellendus in, ipsa a, debitis laudantium blanditiis, aperiam quis assumenda saepe id
                    consequatur officia!</p>
                  <h6>Lorem ipsum</h6>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati et accusamus exercitationem libero
                    voluptas eius quod repellendus in, ipsa a, debitis laudantium blanditiis, aperiam quis assumenda saepe id
                    consequatur officia!</p>
                </div>
                <div class="sg-Dialog-footer">
                  <button type="button" class="sg-Btn sg-Btn--primary js-closeDialog">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <label class="sg-Radio sg-Radio-btn sg-Grid-col6--medium">
      <input type="radio" name="radiocheck-complexRadioButtons" class="sg-Radio-input" />
      <i class="sg-Radio-icon"></i>
      <div class="sg-Radio-text">
        <i class="sg-Radio-contentIcon Icon-home--dark Icon--xlarge"></i>
        <i class="sg-Radio-contentIcon--checked Icon-home--dark Icon--xlarge"></i>
        <strong class="sg-Type--prominent sg-u-marginBottom">Building Only</strong>
        <div class="sg-Type--size14 sg-u-inlineBlock">
          <p>Covers the structure of your home</p>

          <div class="sg-u-textCentre sg-u-inlineBlock sg-u-noMargin">
            <p class="sg-u-inlineBlock sg-u-widthSmall">
              <span class="  sg-Type--strikeBehind sg-u-borderWidth2 sg-u-borderText sg-Type--title sg-Type--size14 sg-u-marginTop sg-u-noMarginBottom" id="subStrikethroughText">save $50</span>
              <span>when you buy online</span>
            </p>
          </div>
        </div>
      </div>
    </label>
    <label class="sg-Radio sg-Radio-btn sg-Grid-col6--medium">
      <input type="radio" name="radiocheck-complexRadioButtons" class="sg-Radio-input" />
      <i class="sg-Radio-icon"></i>
      <div class="sg-Radio-text">
        <i class="sg-Radio-contentIcon Icon-styleGuy--dark Icon--xlarge"></i>
        <i class="sg-Radio-contentIcon--checked Icon-styleGuy--dark Icon--xlarge"></i>
        <span class="sg-u-noMargin sg-Type--prominent">Landlord</span>
      </div>
    </label>
  </div>
  */
  /* change to ul, li */
  const radioGroup = document.createElement('div');
  radioGroup.className = "sg-Radio-table sg-Radio-table--2cols sg-Radio-table--collapseLarge";
  [...block.children].forEach((row) => {
    const label = document.createElement('label');
    let text = 'Landlord';
   
    label.className = 'sg-Radio sg-Radio-btn sg-Grid-col6--medium';
    [...row.attributes].forEach(({ nodeName, nodeValue }) => {
      label.setAttribute(nodeName, nodeValue);
      
    });
    while (row.firstElementChild) label.append(row.firstElementChild);
    [...label.children].forEach((div) => {
      if(div.textContent) {
        text = div.textContent;
        console.log(div.textContent)
      }
    });
    label.innerHTML = '';
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'radiocheck-complexRadioButtons');
    input.setAttribute('aria-describedby', 'sgdocs-dialog-button-tooltip6');
    input.className = 'sg-Radio-input';
    label.append(input);
    const info = document.createElement('i');
    info.className = 'sg-Radio-icon';
    label.append(info);
    const radioText = document.createElement('div');
    radioText.className = 'sg-Radio-text';
    const radioTextIcon = document.createElement('i');
    const radioTextContentIcon = document.createElement('i');
    const radioTextContent = document.createElement('span');
    radioTextIcon.className = 'sg-Radio-contentIcon Icon-styleGuy--dark Icon--xlarge';
    radioTextContentIcon.className = 'sg-Radio-contentIcon--checked Icon-styleGuy--dark Icon--xlarge';
    radioTextContent.className = 'sg-u-noMargin sg-Type--prominent';
    radioTextContent.textContent = text;
    radioText.append(radioTextIcon);
    radioText.append(radioTextContentIcon)
    radioText.append(radioTextContent);
    label.append(radioText);
    radioGroup.append(label);
  });
  block.textContent = '';
  block.append(radioGroup);
}

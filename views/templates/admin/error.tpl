{**
 * Copyright (C) 2017-2024 thirty bees
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@thirtybees.com so we can send you a copy immediately.
 *
 * @author    thirty bees <modules@thirtybees.com>
 * @copyright 2017-2024 thirty bees
 * @license   Academic Free License (AFL 3.0)
 *}
<div class="panel" id="error-block" style="{if !isset($errorMessage) || !$errorMessage}display:none{/if}">
  <div class="panel-heading">
    {l s='Oh snap! We have encountered an error' mod='coreupdater'}
  </div>
  <div class="alert alert-danger">
    <h4 id="error-message">{if isset($errorMessage)}{$errorMessage}{/if}</h4>
    <div>
      {l s='Details' mod='coreupdater'}
    </div>
    <pre id="error-details">{if isset($errorDetails)}{$errorDetails}{/if}</pre>
  </div>
</div>

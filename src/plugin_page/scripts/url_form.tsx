const { pp_getAdditionalLinks } = require('../../common/reference');

// export function initializeUrlForm() {
//   console.log('initializeUrlForm'); 

// };

const updateGroupList = () => {
    pp_getAdditionalLinks().then((accountDetails) => {
      const groupList = document.getElementById('group-list');
      groupList.innerHTML = '';
      if (accountDetails['groups']) {
        Object.keys(accountDetails['groups']).forEach((group) => {
          const groupItem = document.createElement('div');
          groupItem.classList.add('group-item');
          groupItem.innerText = group;
          groupList.appendChild(groupItem);
        });
      }
    });
  };
export const pg_updateGroupList = updateGroupList;
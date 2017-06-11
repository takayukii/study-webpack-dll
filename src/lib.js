export async function process() {
  try {
    console.log('fetching data..');
    const data = await fetch();
    console.log('await fetch', data);
    return data;
  } catch (error) {
    throw error;
  }
}

function fetch() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'ok'
      });
    }, 3000);
  });
}
